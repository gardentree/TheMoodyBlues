namespace Twitter {
  type TweetID = string;
  interface Tweet {
    id: number;
    id_str: TweetID;
    full_text: string;
    user: User;
    retweeted_status?: Tweet;
    quoted_status?: Tweet;
    extended_entities?: {
      media: Media[];
    };
    display_text_range: number[];
    entities: {
      user_mentions: Mention[];
      urls: URL[];
      hashtags: Hashtag[];
      media?: Media[];
    };
    since_id?: string;
    created_at: string;
    quoted_status_permalink?: URL;
    in_reply_to_status_id_str: string | null;
    is_quote_status: boolean;
  }
  type UserID = string;
  type ScreenName = string;
  interface User {
    id_str: UserID;
    profile_image_url_https: string;
    screen_name: ScreenName;
  }
  interface URL {
    url: string;
    expanded_url: string;
    display_url: string;
    indices: number[];
  }
  interface Mention {
    screen_name: string;
    indices: number[];
  }
  interface Hashtag {
    text: string;
    indices: number[];
  }
  type MediaID = string;
  interface Media {
    id_str: MediaID;
    media_url_https: string;
    type: string;
    video_info: {
      variants: MediaVideoVariant[];
    };
    display_url: string;
    indices: number[];
  }
  interface MediaVideoVariant {
    url: string;
    bitrate: number;
  }

  type EntityElement = URL | Mention | Hashtag | Media;

  interface List {
    id_str: string;
    name: string;
  }
}

namespace Twitter2 {
  interface Response {
    data: Tweet | Tweet[];
    includes: Includes;
    meta: {
      result_count: number;
    };
    errors?: Error[];
  }
  interface Error {
    resource_type: "tweet";
    parameter: "referenced_tweets.id";
    type: "https://api.twitter.com/2/problems/resource-not-found" | "https://api.twitter.com/2/problems/not-authorized-for-resource";
  }

  interface Tweet {
    id: Twitter.TweetID;
    text: string;
    author_id: string;
    conversation_id: string;
    created_at: string;
    entities?: Entities;
    referenced_tweets: {
      type: "replied_to" | "quoted";
      id: string;
    }[];
    attachments?: {
      media_keys?: MediaKey[];
    };
  }
  interface Includes {
    users: User[];
    media?: Media[];
    tweets?: Tweet[];
  }
  interface Entities {
    urls?: URL[];
    mentions?: Mention[];
    hashtags?: Hashtag[];
  }
  interface URL {
    url: string;
    expanded_url: string;
    display_url: string;
    start: number;
    end: number;
    status?: number;
  }
  interface Mention {
    username: string;
    start: number;
    end: number;
  }
  interface Hashtag {
    tag: string;
    start: number;
    end: number;
  }
  type MediaKey = string;
  interface Media {
    media_key: MediaKey;
    type: "photo" | "video" | "animated_gif";
    url: string;
    preview_image_url: string;
  }

  interface User {
    id: Twitter.UserID;
    name: string;
    username: string;
    profile_image_url: string;
  }
}
