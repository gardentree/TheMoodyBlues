interface Window {
  TheMoodyBlues: {
    storage: {
      getAccessKey(): string;
      setAccessKey(value: string);
      getAccessSecret(): string;
      setAccessSecret(value: string);
      getMuteKeywords(): string[];
      setMuteKeywords(keywords: string[]);
      getTweets(name: string);
      setTweets(name: string, tweets: TweetType[]);
    };
    authorize: any;
    keybinds: any;
    growl: any;
    openTweetMenu: any;
    openExternal: any;
    logger: any;
  };
}

interface TweetMenuType {
  tweet: TweetType;
  keyword: string;
}

declare module "growly" {
  declare function notify(any, any);
}
