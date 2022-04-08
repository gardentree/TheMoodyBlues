declare namespace TheMoodyBlues {
  interface State {
    screens: ScreenMap;
    principal: Principal;
    preferences: PreferenceMap;
    lineage: Lineage;
  }
  type ScreenMap = Map<ScreenID, Screen>;
  type PreferenceMap = Map<ScreenID, Preference>;

  interface Screen {
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
    query: string;
  }>;

  interface Preference {
    identity: ScreenID;
    screen: ScreenPreference;
    mute: MutePreference;
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
}

interface Window {
  facade: TMB.Facade;
}
