export function setup(client: any): TwitterAgent {
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

  client.lists = () => {
    return new Promise((resolve, reject) => {
      const option = {};
      client.get("lists/list.json", option, (error: string, lists: any, response: any) => {
        if (error) {
          return reject(error);
        }

        resolve(lists);
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
