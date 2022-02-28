namespace TheMoodyBlues {
  interface State {
    screens: ScreenMap;
    principal: Principal;
    preferences: PreferenceMap;
    lineage: Lineage;
  }
  type ScreenID = string;
  type ScreenMap = Map<ScreenID, Screen>;
  type PreferenceMap = Map<ScreenID, Preference>;

  interface Screen {
    tweets: Twitter.Tweet[];
    mode: ArticleMode;
    lastReadID: Twitter.TweetID;
    state: ScreenState;
    options?: Partial<{
      query: string;
    }>;
  }
  type ArticleMode = "tweet" | "media";
  interface ScreenState {
    action: ScreenAction;
    time: number;
  }
  type ScreenAction = "started" | "updated" | "killed";

  interface Preference {
    identity: ScreenID;
    screen: ScreenPreference;
    mute: MutePreference;
  }
  interface ScreenPreference {
    identity: ScreenID;
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

  type Lineage = Map<ScreenID, ScreenID[]>;

  interface Principal {
    screens: ScreenID[];
    focused: ScreenID;
    nowLoading: boolean;
    style: PrincipalStyle;
  }
  interface PrincipalStyle {
    fontSize: string;
  }

  interface TwitterAgent {
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
      getScreenPreferences(): Promise<ScreenPreference[]>;
      setScreenPreferences(screens: ScreenPreference[]);
      getMutePreference(): Promise<MutePreference>;
      setMutePreference(preference: MutePreference);
    };
    actions: {
      authorize(verifier: string);
      copy(text: string): void;
      growl(tweets: Twitter.Tweet[]): void;
      openExternal(url: string): void;
      openTweetMenu(context: TweetMenu): void;
      showModeMenu(identity: ScreenID, mode: ArticleMode): void;
    };
    events: {
      onAlert(callback: (error: unknown) => void);
      onChangeMode(callback: (identity: ScreenID, mode: TweetListMode) => void);
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
import TMB = TheMoodyBlues;

interface Window {
  facade: TMB.Facade;
}
declare module "growly" {
  declare function notify(message: string, {title: string, icon: string});
}
