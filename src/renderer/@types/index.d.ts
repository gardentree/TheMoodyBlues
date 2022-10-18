type EntityState<T> = import("@reduxjs/toolkit").EntityState<T>;

declare namespace TheMoodyBlues {
  interface State {
    screens: ScreenMap;
    principal: Principal;
    preferences: PreferenceMap;
    lineage: Lineage;
  }
  type ScreenMap = EntityState<Screen>;
  type PreferenceMap = EntityState<Preference>;

  interface Screen {
    identity: ScreenID;
    tweets: Twitter.Tweet[];
    mode: ArticleMode;
    lastReadID: Twitter.TweetID;
    status: ScreenStatus;
    options?: ScreenOptions;
  }
  type ArticleMode = "tweet" | "media";
  interface ScreenStatus {
    status: string;
  }
  type ScreenOptions = Partial<{
    query?: string;
    source?: Twitter.Tweet;
  }>;

  interface Preference {
    identity: ScreenID;
    screen: ScreenPreference;
    mute: MutePreference;
  }

  type Lineage = EntityState<LineageTree>;
  interface LineageTree {
    root: ScreenID;
    branches: ScreenID[];
  }

  interface Principal {
    screens: ScreenID[];
    focused: ScreenID;
    nowLoading: boolean;
    style: PrincipalStyle;
  }
  interface PrincipalStyle {
    fontSize: string;
  }
}

interface Window {
  facade: TMB.Facade;
}
