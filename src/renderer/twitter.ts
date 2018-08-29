export interface Tweet {
  id_str: string;
  full_text: string;
  user: User;
  retweeted_status?: Tweet;
  quoted_status?: Tweet;
  extended_entities?: {
    media: Media[]
  };
  display_text_range: number[];
  entities: {
    urls: {
      url: string;
      expanded_url: string;
      display_url: string;
    }[];
  };
  since_id: string;
  created_at: string;
}
interface User {
  id_str: string;
  profile_image_url_https: string;
  screen_name: string;
}
interface Media {
  id_str: string;
  media_url_https: string;
}
