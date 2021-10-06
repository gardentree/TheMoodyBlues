interface TweetType {
  id: number;
  id_str: string;
  full_text: string;
  user: UserType;
  retweeted_status?: TweetType;
  quoted_status?: TweetType;
  extended_entities?: {
    media: MediaType[];
  };
  display_text_range: number[];
  entities: {
    user_mentions: {
      indices: number[];
    };
    urls: URLType[];
  };
  since_id: string;
  created_at: string;
  quoted_status_permalink: URLType;
  in_reply_to_status_id_str: string;
}
interface UserType {
  id_str: string;
  profile_image_url_https: string;
  screen_name: string;
}
interface MediaType {
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
interface URLType {
  url: string;
  expanded_url: string;
  display_url: string;
  indices?: number[];
}
