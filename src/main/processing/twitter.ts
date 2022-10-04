import TwitterClient from "twitter";
import TwitterClient2, {RequestParameters} from "twitter-v2";
import logger from "@libraries/logger";
import {retry} from "./twitter/utility";
import {degrade} from "./twitter/degrader";

export function incarnate(client: TwitterClient, client2: TwitterClient2): TMB.TwitterAgent {
  async function retrieve2(endpoint: string, parameters: RequestParameters, allows?: Twitter2.Error[]): Promise<Twitter2.Response> {
    const response: Twitter2.Response = await client2.get(endpoint, parameters);
    if (response.errors) {
      logger.error(JSON.stringify({endpoint, parameters, response}));

      const allowed = (() => {
        if (!allows) {
          return false;
        }

        for (const error of response.errors) {
          for (const allow of allows) {
            for (const [key, value] of Object.entries(allow)) {
              if (error[key] == value) {
                return true;
              }
            }
          }
        }

        return false;
      })();

      if (!allowed) {
        throw new Error(JSON.stringify(response.errors));
      }
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
      const allows: Twitter2.Error[] = [
        {
          resource_type: "tweet",
          parameter: "referenced_tweets.id",
          type: "https://api.twitter.com/2/problems/resource-not-found",
        },
        {
          resource_type: "tweet",
          parameter: "referenced_tweets.id",
          type: "https://api.twitter.com/2/problems/not-authorized-for-resource",
        },
      ];

      const originResponse = await retrieve2(`tweets/${criterion.id_str}`, parameters, allows);
      const origin = originResponse.data as Twitter2.Tweet;

      let query: string;
      if (options?.yourself) {
        query = `conversation_id:${origin.conversation_id} from:${origin.author_id}`;
      } else {
        query = `conversation_id:${origin.conversation_id}`;
      }

      const response = await retrieve2(
        "tweets/search/recent",
        {
          ...parameters,
          query: query,
          max_results: "100",
        },
        allows
      );

      const tweets = degrade(response);

      const ids = tweets.map((tweet) => tweet.id_str);
      if (!ids.includes(origin.id)) {
        tweets.push(criterion);
      }

      if (origin.referenced_tweets && origin.referenced_tweets[0].type == "replied_to") {
        const repliedID = origin.referenced_tweets[0].id;
        if (!ids.includes(repliedID) && !originResponse.errors) {
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
