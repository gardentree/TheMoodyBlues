import TwitterClient from "twitter";

export function incarnate(client: any): TheMoodyBlues.TwitterAgent {
  return {
    retrieveTimeline: (since_id: string | null) => {
      let option: any = {
        count: 200,
        include_entities: true,
        tweet_mode: "extended",
      };
      if (since_id) option.since_id = since_id;

      return new Promise<Twitter.Tweet[]>((resolve, reject) => {
        console.log(client);
        client.get("statuses/home_timeline", option, (error: string, tweets: Twitter.Tweet[], response: any) => {
          if (error) {
            return reject(error);
          }

          resolve(tweets);
        });
      });
    },

    search: (query: string, since_id: string | null) => {
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
    },

    retrieveTimelineOfUser: (name: string): Promise<Twitter.Tweet[]> => {
      let option: any = {
        screen_name: name,
        count: 100,
        exclude_replies: false,
        include_rts: true,
        tweet_mode: "extended",
      };

      return new Promise<Twitter.Tweet[]>((resolve, reject) => {
        client.get("statuses/user_timeline", option, (error: string, tweets: Twitter.Tweet[], response: any) => {
          if (error) return reject(error);

          resolve(tweets);
        });
      });
    },

    retrieveMentions: (since_id: string | null) => {
      let option: any = {
        count: 200,
        include_entities: true,
        tweet_mode: "extended",
      };
      if (since_id) option.since_id = since_id;

      return new Promise<Twitter.Tweet[]>((resolve, reject) => {
        client.get("statuses/mentions_timeline", option, (error: string, tweets: Twitter.Tweet[], response: any) => {
          if (error) return reject(error);

          resolve(tweets);
        });
      });
    },

    retrieveConversation: (criterion: Twitter.Tweet) => {
      return new Promise((resolve, reject) => {
        (async () => {
          var tweets: Twitter.Tweet[] = await new Promise<Twitter.Tweet[]>((resolve, reject) => {
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

              let tweets: Twitter.Tweet[] = body["statuses"];
              resolve(tweets.filter((tweet) => criterion.id_str === tweet.in_reply_to_status_id_str));
            });
          });

          tweets.push(criterion);
          var target = criterion;
          for (var i = 0; !!target.in_reply_to_status_id_str && i < 20; i++) {
            target = await new Promise<Twitter.Tweet>((resolve, reject) => {
              let option: any = {
                id: target.in_reply_to_status_id_str,
                include_entities: true,
                tweet_mode: "extended",
              };

              client.get("statuses/show", option, (error: string, tweet: Twitter.Tweet, response: any) => {
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
    },

    lists: (): Promise<Twitter.List[]> => {
      return new Promise((resolve, reject) => {
        const option = {};
        client.get("lists/list.json", option, (error: string, lists: Twitter.List[], response: any) => {
          if (error) {
            return reject(error);
          }

          resolve(lists.reverse());
        });
      });
    },
    retrieveTimelineOfList: (list_id: string, since_id: string | null) => {
      const option: any = {
        list_id: list_id,
        count: 200,
        include_entities: true,
        tweet_mode: "extended",
      };
      if (since_id) option.since_id = since_id;

      return new Promise((resolve, reject) => {
        client.get("lists/statuses.json", option, (error: string, tweets: Twitter.Tweet[], response: any) => {
          if (error) {
            return reject(error);
          }

          resolve(tweets);
        });
      });
    },
  };
}
