namespace Twitter {
  interface Tweet {
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
    in_reply_to_status_id_str: string;
  }
  interface User {
    id_str: string;
    profile_image_url_https: string;
    screen_name: string;
  }
  interface Media {
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
  interface URL {
    url: string;
    expanded_url: string;
    display_url: string;
    indices?: number[];
  }
  interface List {
    id_str: string;
    name: string;
  }
}
