import TwitterClient from "twitter";
import TwitterClient2, {RequestParameters} from "twitter-v2";
import * as DateUtility from "date-fns-tz";
import logger from "electron-log";

function retry<P>(processing: () => Promise<P>, retryCount: number) {
  let promise: Promise<P> = processing();
  for (let i = 1; i <= retryCount; i++) {
    promise = promise.catch((error) => {
      logger.error(error);

      if (error.code == "ENOTFOUND") {
        logger.error(`retry ${i}`);
        return processing();
      }

      throw new Error(error);
    });
  }
  return promise;
}

export function incarnate(client: TwitterClient, client2: TwitterClient2): TMB.TwitterAgent {
  async function retrieve2(endpoint: string, parameters: RequestParameters): Promise<Twitter2.Response> {
    const response: Twitter2.Response = await client2.get(endpoint, parameters);
    if (response.errors) {
      throw new Error(JSON.stringify(response.errors));
    }

    return response;
  }
  function retrieve1(endpoint: string, parameters: TwitterClient.RequestParams): Promise<Twitter.Tweet[]> {
    return retry<Twitter.Tweet[]>(
      () =>
        client.get(endpoint, parameters).then((data) => {
          if (data.statuses) {
            return data.statuses as Twitter.Tweet[];
          } else {
            return data as Twitter.Tweet[];
          }
        }),
      3
    );
  }

  return {
    retrieveTimeline: (since_id) => {
      const option: TwitterClient.RequestParams = {
        count: 200,
        include_entities: true,
        tweet_mode: "extended",
      };
      if (since_id) option.since_id = since_id;

      return retrieve1("statuses/home_timeline", option);
    },

    search: (query, since_id) => {
      const option: TwitterClient.RequestParams = {
        q: `${query} -rt`,
        count: 100,
        include_entities: true,
        tweet_mode: "extended",
      };
      if (since_id) option.since_id = since_id;

      return retrieve1("search/tweets", option);
    },

    retrieveTimelineOfUser: (name) => {
      const option: TwitterClient.RequestParams = {
        screen_name: name,
        count: 100,
        exclude_replies: false,
        include_rts: true,
        tweet_mode: "extended",
      };

      return retrieve1("statuses/user_timeline", option);
    },

    retrieveMentions: (since_id) => {
      const option: TwitterClient.RequestParams = {
        count: 200,
        include_entities: true,
        tweet_mode: "extended",
      };
      if (since_id) option.since_id = since_id;

      return retrieve1("statuses/mentions_timeline", option);
    },

    retrieveConversation: async (criterion, options) => {
      const parameters = {
        expansions: "attachments.media_keys,author_id,entities.mentions.username,in_reply_to_user_id,referenced_tweets.id,referenced_tweets.id.author_id",
        "user.fields": "id,name,profile_image_url",
        "media.fields": "duration_ms,height,media_key,preview_image_url,type,url,width,alt_text",
        "tweet.fields": "attachments,author_id,conversation_id,created_at,entities,referenced_tweets",
      };

      const originResponse = await retrieve2(`tweets/${criterion.id_str}`, parameters);
      const origin = originResponse.data as Twitter2.Tweet;

      let query: string;
      if (options?.yourself) {
        query = `conversation_id:${origin.conversation_id} from:${origin.author_id}`;
      } else {
        query = `conversation_id:${origin.conversation_id}`;
      }

      const response = await retrieve2("tweets/search/recent", {
        ...parameters,
        query: query,
        max_results: "100",
      });

      const tweets = degrade(response);

      const ids = tweets.map((tweet) => tweet.id_str);
      if (!ids.includes(origin.id)) {
        tweets.push(criterion);
      }

      if (origin.referenced_tweets && origin.referenced_tweets[0].type == "replied_to") {
        const repliedID = origin.referenced_tweets[0].id;
        if (!ids.includes(repliedID)) {
          const replied = await retrieve2(`tweets/${repliedID}`, parameters);

          tweets.push(degrade(replied)[0]);
        }
      }

      return tweets.reverse();
    },

    lists: () => {
      return new Promise((resolve, reject) => {
        const option = {};
        client.get("lists/list.json", option, (error, data, response) => {
          if (error) {
            return reject(error);
          }

          resolve((data as Twitter.List[]).reverse());
        });
      });
    },
    retrieveTimelineOfList: (list_id, since_id) => {
      const option: TwitterClient.RequestParams = {
        list_id: list_id,
        count: 200,
        include_entities: true,
        tweet_mode: "extended",
      };
      if (since_id) option.since_id = since_id;

      return retrieve1("lists/statuses.json", option);
    },
  };
}

function degrade(v2: Twitter2.Response): Twitter.Tweet[] {
  if (v2.meta?.result_count <= 0) {
    return [];
  }

  const v1: Twitter.Tweet[] = [];
  const includes = degradeIncludeMap(v2.includes);

  if (Array.isArray(v2.data)) {
    for (const tweet of v2.data) {
      v1.push(degradeTweet(tweet, includes));
    }
  } else {
    v1.push(degradeTweet(v2.data, includes));
  }

  return v1;
}
function degradeTweet(tweet: Twitter2.Tweet, includes: IncludeMap, referenced = false): Twitter.Tweet {
  const v1: Twitter.Tweet = {
    created_at: degradeDate(tweet.created_at),
    id: Number(tweet.id),
    id_str: tweet.id,
    full_text: tweet.text,
    user: includes.users.get(tweet.author_id)!,
    display_text_range: calculateDisplayTextRange(tweet, includes, referenced),
    entities: {
      hashtags: [],
      user_mentions: [],
      urls: [],
    },
    in_reply_to_status_id_str: null,
    is_quote_status: false,
  };

  if (tweet.entities) {
    if (tweet.entities.urls) {
      v1.entities.urls = tweet.entities.urls.map((url) => degradeURL(url));
    }
    if (tweet.entities.mentions) {
      v1.entities.user_mentions = tweet.entities.mentions.map((mention) => degradeMention(mention));
    }
    if (tweet.entities.hashtags) {
      v1.entities.hashtags = tweet.entities.hashtags.map((hashtag) => degradeHashtag(hashtag));
    }
  }

  if (tweet.attachments && !referenced) {
    if (tweet.attachments.media_keys) {
      const media: Twitter.Media[] = tweet.attachments.media_keys.map((key) => includes.media.get(key)!);

      if (!v1.extended_entities) {
        v1.extended_entities = {media: []};
      }
      v1.extended_entities!.media = media;

      const urls = v1.entities.urls.splice(v1.entities.urls.length - v1.extended_entities!.media.length, v1.extended_entities!.media.length);
      for (let i = 0; i < v1.extended_entities!.media.length; i++) {
        Object.assign(v1.extended_entities!.media[i], urls[i]);
      }

      v1.entities.media = v1.extended_entities!.media.map((medium: Twitter.Media) => Object.assign({}, medium, {type: "photo"}));
    }
  }

  if (tweet.referenced_tweets) {
    const referenced = tweet.referenced_tweets[0];
    switch (referenced.type) {
      case "replied_to":
        v1.in_reply_to_status_id_str = referenced.id;

        break;
      case "quoted":
        v1.is_quote_status = true;

        break;
    }
  } else {
    v1.is_quote_status = false;
  }

  return v1;
}
function calculateDisplayTextRange(tweet: Twitter2.Tweet, includes: IncludeMap, referenced: boolean) {
  if (tweet.entities?.urls) {
    const last = tweet.entities.urls[tweet.entities.urls.length - 1];
    if (last.status) {
      return [0, measure(tweet.text)];
    } else {
      return [0, measure(tweet.text.replace(/https:\/\/t.co\/[a-zA-Z\d]+$/, "").trimEnd())];
    }
  } else {
    return [0, measure(tweet.text)];
  }
}
function degradeURL(v2: Twitter2.URL): Twitter.URL {
  return {
    url: v2.url,
    expanded_url: v2.expanded_url,
    display_url: v2.display_url,
    indices: [v2.start, v2.end],
  };
}
function degradeMention(v2: Twitter2.Mention): Twitter.Mention {
  return {
    screen_name: v2.username,
    indices: [v2.start, v2.end],
  };
}
function degradeHashtag(v2: Twitter2.Hashtag): Twitter.Hashtag {
  return {
    text: v2.tag,
    indices: [v2.start, v2.end],
  };
}

interface IncludeMap {
  users: UserMap;
  media: MediaMap;
  tweets: TweetMap;
}
type UserMap = Map<Twitter.UserID, Twitter.User>;
type MediaMap = Map<Twitter2.MediaKey, Twitter.Media>;
type TweetMap = Map<Twitter.TweetID, Twitter.Tweet>;

function degradeIncludeMap(v2: Twitter2.Includes): IncludeMap {
  const v1 = {
    users: degradeUsers(v2.users),
    media: degradeMedia(v2.media),
    tweets: new Map(),
  };

  if (v2.tweets) {
    for (const tweet of v2.tweets) {
      v1.tweets.set(tweet.id, degradeTweet(tweet, v1, true));
    }
  }

  return v1;
}
function degradeUsers(v2: Twitter2.User[]): UserMap {
  const v1 = new Map();

  for (const user of v2) {
    v1.set(user.id, {
      id_str: user.id,
      profile_image_url_https: user.profile_image_url,
      screen_name: user.username,
    });
  }

  return v1;
}
function degradeMedia(v2?: Twitter2.Media[]): MediaMap {
  const v1 = new Map();

  if (!v2) {
    return v1;
  }
  for (const medium of v2) {
    switch (medium.type) {
      case "photo":
      case "animated_gif":
        v1.set(medium.media_key, {
          id_str: medium.media_key.split("_")[1],
          type: medium.type,
          media_url_https: medium.url,
        });
        break;
      case "video":
        v1.set(medium.media_key, {
          id_str: medium.media_key.split("_")[1],
          type: medium.type,
          media_url_https: medium.preview_image_url,
        });
        break;
      default:
        throw new Error(medium.type);
    }
  }

  return v1;
}

function degradeDate(date: string): string {
  const utc = new Date(date);
  return DateUtility.format(new Date(utc.getTime() + utc.getTimezoneOffset() * 60 * 1000), "EEE LLL dd HH:mm:ss xx Y", {timeZone: "UTC"});
}

function measure(text: string): number {
  return Array.from(text).length;
}
