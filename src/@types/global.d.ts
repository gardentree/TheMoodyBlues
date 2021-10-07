interface Window {
  TheMoodyBlues: any;
}

interface TweetMenuType {
  tweet: TweetType;
  keyword: string;
}

declare module "growly" {
  declare function notify(any, any);
}
