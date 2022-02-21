namespace TheMoodyBlues {
  interface State {
    timelines: TimelineMap;
    subcontents: SubContents;
    principal: Principal;
    preferences: PreferenceMap;
  }
  type TimelineIdentity = string;
  type TimelineMap = Map<TimelineIdentity, Timeline>;
  type PreferenceMap = Map<TimelineIdentity, Preference>;

  interface Timeline {
    tweets: Twitter.Tweet[];
    mode: ArticleMode;
    state: {
      lastReadID: string;
      query?: string;
    };
  }
  type ArticleMode = "tweet" | "media";

  interface Preference {
    identity: TimelineIdentity;
    timeline: TimelinePreference;
    mute: MutePreference;
  }
  interface TimelinePreference {
    identity: TimelineIdentity;
    title: string;
    component: "Timeline" | "Search";
    interval: number;
    way: "retrieveTimeline" | "search" | "retrieveMentions" | "retrieveTimelineOfList";
    parameters?: any[];
    active: boolean;
    growl: boolean;
    mute: boolean;
  }
  interface MutePreference {
    keywords: string[];
    selfRetweet: boolean;
    media: Twitter.UserID[];
  }

  interface SubContents {
    tweets: Twitter.Tweet[];
  }

  interface Principal {
    contents: TimelineIdentity[];
    focused: TimelineIdentity;
    nowLoading: boolean;
    style: PrincipalStyle;
  }
  interface PrincipalStyle {
    fontSize: string;
  }

  interface TwitterAgent {
    get(path: string, parameters: RequestParameters): Promise<Twitter2.Response>;

    retrieveTimeline(since_id: string | null): Promise<Twitter.Tweet[]>;
    search(query: string, since_id: string | null): Promise<Twitter.Tweet[]>;
    retrieveTimelineOfUser(name: string): Promise<Twitter.Tweet[]>;
    retrieveMentions(since_id: string | null): Promise<Twitter.Tweet[]>;
    retrieveConversation(criterion: Twitter.Tweet, options?: {yourself?: boolean}): Promise<Twitter.Tweet[]>;
    lists(): Promise<Twitter.List[]>;
    retrieveTimelineOfList(list_id: string, since_id: string | null): Promise<Twitter.Tweet[]>;
  }

  interface TweetMenu {
    tweet: Twitter.Tweet;
    keyword: string;
  }

  interface Facade {
    agent: TwitterAgent;
    storage: {
      getTweets(name: string): Promise<Twitter.Tweet[]>;
      setTweets(name: string, tweets: Twitter.Tweet[]);
      getTimelinePreferences(): Promise<TimelinePreference[]>;
      setTimelinePreferences(timelines: TimelinePreference[]);
      getMutePreference(): Promise<MutePreference>;
      setMutePreference(preference: MutePreference);
    };
    actions: {
      authorize(verifier: string);
      copy(text: string): void;
      growl(tweets: Twitter.Tweet[]): void;
      openExternal(url: string): void;
      openTweetMenu(context: TweetMenu): void;
      showModeMenu(identity: TimelineIdentity, mode: ArticleMode): void;
    };
    events: {
      onAlert(callback: (error: unknown) => void);
      onChangeMode(callback: (identity: TimelineIdentity, mode: TweetListMode) => void);
      onCopyTweetInJSON(callback: (tweet: Twitter.Tweet) => void);
      onFocusLatestTweet(callback: () => void);
      onFocusUnreadTweet(callback: () => void);
      onForceReload(callback: () => void);
      onLaunch(callback: () => void);
      onOpenTweetInBrowser(callback: (tweet: Twitter.Tweet) => void);
      onRefreshPreferences(callback: () => void);
      onReload(callback: () => void);
      onSearch(callback: (keyword: string) => void);
      onShowChainForTweet(callback: (tweet: Twitter.Tweet) => void);
      onShowConversationForTweet(callback: (tweet: Twitter.Tweet) => void);
      onShowVerifierForm(callback: () => void);
      onZoomIn(callback: () => void);
      onZoomOut(callback: () => void);
      onZoomReset(callback: () => void);
    };
    logger: {
      info(message: LogMessage): void;
      error(message: LogMessage): void;
      verbose(message: LogMessage): void;
    };
  }
  type LogMessage = string | object | undefined | null | unknown;
}

interface Window {
  facade: TheMoodyBlues.Facade;
}
declare module "growly" {
  declare function notify(message: string, {title: string, icon: string});
}
