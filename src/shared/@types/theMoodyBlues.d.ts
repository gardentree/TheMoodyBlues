type EntityState<T> = import("@reduxjs/toolkit").EntityState<T>;

declare namespace TheMoodyBlues {
  type ScreenID = string;

  interface ScreenPreference {
    identity: ScreenID;
    title: string;
    component: "Timeline" | "Search";
    interval: number;
    way: "retrieveTimeline" | "search" | "retrieveMentions" | "retrieveTimelineOfList";
    parameters?: string[] | undefined;
    active: boolean;
    growl: boolean;
    mute: boolean;
  }
  type PassengerIdentifier = "@everyone" | Twitter.UserID;
  type MutePreference = Record<PassengerIdentifier, PassengerPreference>;
  interface PassengerPreference {
    identifier: PassengerIdentifier;
    name: Twitter.ScreenName;
    taboos: Record<string, Taboo>;
    withMedia: boolean;
    retweetYourself: boolean;
    retweetReaction: boolean;
  }
  interface Taboo {
    keyword: string;
    expireAt: number;
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
      setTweets(name: string, tweets: Twitter.Tweet[]): void;
      getScreenPreferences(): Promise<ScreenPreference[]>;
      setScreenPreferences(screens: ScreenPreference[]): void;
      getMutePreference(): Promise<MutePreference>;
      setMutePreference(preference: MutePreference): void;
    };
    actions: {
      authorize(verifier: string): void;
      copy(text: string): void;
      growl(tweets: Twitter.Tweet[]): void;
      openExternal(url: string): void;
      openTweetMenu(context: TweetMenu): void;
      showModeMenu(identity: ScreenID, mode: ArticleMode): void;
    };
    events: {
      onAlert(callback: (error: unknown) => void): void;
      onChangeMode(callback: (identity: ScreenID, mode: ArticleMode) => void): void;
      onCopyTweetInJSON(callback: (tweet: Twitter.Tweet) => void): void;
      onDialog(callback: (context: TMB.Dialog) => void): void;
      onFocusLatestTweet(callback: () => void): void;
      onFocusTweet(callback: (tweet: Twitter.Tweet) => void): void;
      onFocusUnreadTweet(callback: () => void): void;
      onForceReload(callback: () => void): void;
      onLaunch(callback: () => void): void;
      onOpenTweetInBrowser(callback: (tweet: Twitter.Tweet) => void): void;
      onRefreshPreferences(callback: () => void): void;
      onReload(callback: () => void): void;
      onSearch(callback: (keyword: string) => void): void;
      onShowChainForTweet(callback: (tweet: Twitter.Tweet) => void): void;
      onShowConversationForTweet(callback: (tweet: Twitter.Tweet) => void): void;
      onShowVerifierForm(callback: () => void): void;
      onZoomIn(callback: () => void): void;
      onZoomOut(callback: () => void): void;
      onZoomReset(callback: () => void): void;
    };
    collaborators: {
      growl(): boolean;
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
