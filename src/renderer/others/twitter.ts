export interface Tweet {
  id: number;
  id_str: string;
  full_text: string;
  user: User;
  retweeted_status?: Tweet;
  quoted_status?: Tweet;
  extended_entities?: {
    media: Media[];
  };
  display_text_range: number[];
  entities: {
    user_mentions: {
      indices: number[];
    };
    urls: URL[];
  };
  since_id: string;
  created_at: string;
  quoted_status_permalink: URL;
}
export interface User {
  id_str: string;
  profile_image_url_https: string;
  screen_name: string;
}
export interface Media {
  id_str: string;
  media_url_https: string;
  type: string;
  video_info: {
    variants: {
      url: string;
      bitrate: number;
    }[];
  };
}
export interface URL {
  url: string;
  expanded_url: string;
  display_url: string;
  indices?: number[];
}

const logger = require("electron-log");
export function setup(client: any) {
  client.get = client.get.bind(client);

  client.timeline = (since_id: string | null) => {
    let option: any = {
      count: 200,
      include_entities: true,
      tweet_mode: "extended",
    };
    if (since_id) option.since_id = since_id;

    logger.info(option);
    return new Promise((resolve, reject) => {
      client.get("statuses/home_timeline", option, (error: string, tweets: Tweet[], response: any) => {
        if (error) {
          logger.error(error);
          return reject(error);
        }
        logger.info(`home_timeline ${tweets.length}tweets`);

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

  client.userTimeline = (name: string): Promise<Tweet[]> => {
    let option: any = {
      screen_name: name,
      count: 100,
      exclude_replies: false,
      include_rts: true,
      tweet_mode: "extended",
    };

    return new Promise((resolve, reject) => {
      client.get("statuses/user_timeline", option, (error: string, tweets: Tweet[], response: any) => {
        if (error) return reject(error);

        resolve(tweets);
      });
    });
  };

  client.mentionsTimeline = (since_id: string | null) => {
    let option: any = {
      count: 200,
      include_entities: true,
      tweet_mode: "extended",
    };
    if (since_id) option.since_id = since_id;

    return new Promise((resolve, reject) => {
      client.get("statuses/mentions_timeline", option, (error: string, tweets: Tweet[], response: any) => {
        if (error) return reject(error);

        resolve(tweets);
      });
    });
  };

  return client;
}
