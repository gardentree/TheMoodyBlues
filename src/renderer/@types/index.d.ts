type FormState = import("redux-form").FormState | Record<string, unknown>;

declare namespace TheMoodyBlues {
  interface State {
    screens: ScreenMap;
    principal: Principal;
    preferences: PreferenceMap;
    lineage: Lineage;
    form: FormState;
  }
  type ScreenMap = EntityState<Screen>;
  type PreferenceMap = EntityState<Preference>;

  interface Screen {
    identifier: ScreenID;
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
    identifier: ScreenID;
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
    dialog: Dialog;
  }
  interface PrincipalStyle {
    fontSize: string;
  }
  interface DialogWithGatekeeper {
    type: "mute";
    context: TweetMenu;
  }
  type Dialog = DialogWithGatekeeper | null;
}

interface Window {
  facade: TMB.Facade;
}
