import {shell} from "electron";
import {OAuth} from "oauth";
import storage from "./storage";
import TwitterClient from "twitter";

function setup(client: any): TwitterAgent {
  client.get = client.get.bind(client);

  client.retrieveTimeline = (since_id: string | null) => {
    let option: any = {
      count: 200,
      include_entities: true,
      tweet_mode: "extended",
    };
    if (since_id) option.since_id = since_id;

    return new Promise((resolve, reject) => {
      client.get("statuses/home_timeline", option, (error: string, tweets: TweetType[], response: any) => {
        if (error) {
          return reject(error);
        }

        resolve(tweets);
      });
    });
  };

  client.search = (query: string, since_id: string | null) => {
    let option: any = {
      q: `${query} -rt`,
      count: 100,
      include_entities: true,
      tweet_mode: "extended",
    };
    if (since_id) option.since_id = since_id;

    return new Promise((resolve, reject) => {
      client.get("search/tweets", option, (error: string, body: any, response: any) => {
        if (error) return reject(error);

        resolve(body["statuses"]);
      });
    });
  };

  client.retrieveTimelineOfUser = (name: string): Promise<TweetType[]> => {
    let option: any = {
      screen_name: name,
      count: 100,
      exclude_replies: false,
      include_rts: true,
      tweet_mode: "extended",
    };

    return new Promise((resolve, reject) => {
      client.get("statuses/user_timeline", option, (error: string, tweets: TweetType[], response: any) => {
        if (error) return reject(error);

        resolve(tweets);
      });
    });
  };

  client.retrieveMentions = (since_id: string | null) => {
    let option: any = {
      count: 200,
      include_entities: true,
      tweet_mode: "extended",
    };
    if (since_id) option.since_id = since_id;

    return new Promise((resolve, reject) => {
      client.get("statuses/mentions_timeline", option, (error: string, tweets: TweetType[], response: any) => {
        if (error) return reject(error);

        resolve(tweets);
      });
    });
  };

  client.retrieveConversation = (criterion: TweetType) => {
    return new Promise((resolve, reject) => {
      (async () => {
        var tweets: TweetType[] = await new Promise<TweetType[]>((resolve, reject) => {
          let option: any = {
            q: `to:${criterion.user.screen_name} -rt`,
            count: 200,
            include_entities: true,
            tweet_mode: "extended",
            since_id: criterion.id_str,
          };

          client.get("search/tweets", option, (error: string, body: any, response: any) => {
            if (error) {
              return reject(error);
            }

            let tweets: TweetType[] = body["statuses"];
            resolve(tweets.filter((tweet) => criterion.id_str === tweet.in_reply_to_status_id_str));
          });
        });

        tweets.push(criterion);
        var target = criterion;
        for (var i = 0; !!target.in_reply_to_status_id_str && i < 20; i++) {
          target = await new Promise<TweetType>((resolve, reject) => {
            let option: any = {
              id: target.in_reply_to_status_id_str,
              include_entities: true,
              tweet_mode: "extended",
            };

            client.get("statuses/show", option, (error: string, tweet: TweetType, response: any) => {
              if (error) {
                return reject(error);
              }

              resolve(tweet);
            });
          });

          tweets.push(target);
        }

        resolve(tweets);
      })().catch((error) => {
        throw error;
      });
    });
  };

  client.lists = (): Promise<Twitter.List[]> => {
    return new Promise((resolve, reject) => {
      const option = {};
      client.get("lists/list.json", option, (error: string, lists: any, response: any) => {
        if (error) {
          return reject(error);
        }

        resolve(lists.reverse());
      });
    });
  };
  client.retrieveTimelineOfList = (list_id: string, since_id: string | null) => {
    const option: any = {
      list_id: list_id,
      count: 200,
      include_entities: true,
      tweet_mode: "extended",
    };
    if (since_id) option.since_id = since_id;

    return new Promise((resolve, reject) => {
      client.get("lists/statuses.json", option, (error: string, tweets: TweetType[], response: any) => {
        if (error) {
          return reject(error);
        }

        resolve(tweets);
      });
    });
  };

  return client;
}

const oauth = new OAuth("https://api.twitter.com/oauth/request_token", "https://api.twitter.com/oauth/access_token", process.env.CONSUMER_KEY!, process.env.CONSUMER_SECRET!, "1.0A", null, "HMAC-SHA1");

function loadClient(): any | null {
  const accessKey = storage.getAccessKey();
  const accessSecret = storage.getAccessSecret();

  if (accessKey === void 0 || accessSecret === void 0) {
    return null;
  }

  return createClient({key: accessKey, secret: accessSecret});
}

interface Token {
  key: string;
  secret: string;
}

function createClient(accessToken: Token): any {
  return setup(
    new TwitterClient({
      consumer_key: process.env.CONSUMER_KEY!,
      consumer_secret: process.env.CONSUMER_SECRET!,
      access_token_key: accessToken.key,
      access_token_secret: accessToken.secret,
    })
  );
}

function getRequestToken() {
  return new Promise<Token>((resolve, reject) => {
    oauth.getOAuthRequestToken((error: any, key: string, secret: string, results: any) => {
      if (error) reject(error);

      resolve({key: key, secret: secret});
    });
  });
}
function getAccessToken(requestToken: Token, verifier: string) {
  return new Promise<Token>((resolve, reject) => {
    oauth.getOAuthAccessToken(requestToken.key, requestToken.secret, verifier, (error: any, accessKey: string, accessSecret: string) => {
      if (error) reject(error);

      resolve({key: accessKey, secret: accessSecret});
    });
  });
}

export function call(): TwitterAgent | null {
  const client = loadClient();
  if (client) {
    return setup(client);
  } else {
    return null;
  }
}
export async function authorize(showVerifierForm: () => string): Promise<TwitterAgent> {
  const agent = call();
  if (agent) {
    return agent;
  }

  const requestToken = await getRequestToken();
  shell.openExternal(`https://api.twitter.com/oauth/authorize?oauth_token=${requestToken.key}`);
  const verifier = await showVerifierForm();
  const accessToken = await getAccessToken(requestToken, verifier);

  storage.setAccessKey(accessToken.key);
  storage.setAccessSecret(accessToken.secret);

  return setup(createClient(accessToken));
}
