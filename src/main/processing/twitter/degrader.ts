import * as DateUtility from "date-fns-tz";

export function degrade(v2: Twitter2.Response): Twitter.Tweet[] {
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
export function degradeTweet(tweet: Twitter2.Tweet, includes: IncludeMap, referenced = false): Twitter.Tweet {
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
    for (const referenced of tweet.referenced_tweets) {
      switch (referenced.type) {
        case "replied_to":
          v1.in_reply_to_status_id_str = referenced.id;

          break;
        case "quoted":
          v1.is_quote_status = true;
          v1.quoted_status = includes.tweets.get(referenced.id)!;

          break;
      }
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

export function degradeDate(date: string): string {
  const utc = new Date(date);
  return DateUtility.format(new Date(utc.getTime() + utc.getTimezoneOffset() * 60 * 1000), "EEE LLL dd HH:mm:ss xx Y", {timeZone: "UTC"});
}

function measure(text: string): number {
  return Array.from(text).length;
}
