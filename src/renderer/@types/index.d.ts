type FormState = import("redux-form").FormState | Record<string, unknown>;

declare namespace TheMoodyBlues {
  interface State {
    screens: NormalizedScreen;
    principal: Principal;
    preferences: NormalizedScreenPreference;
    gatekeeper: GatekeeperPreference;
    lineage: Lineage;
    form: FormState;
  }
  type NormalizedScreen = EntityState<Screen>;

  interface Screen {
    identifier: ScreenID;
    tweets: Twitter.Tweet[];
    mode: ArticleMode;
    lastReadID: Twitter.TweetID;
    status: ScreenStatus;
    options?: ScreenOptions;
  }
  interface ScreenStatus {
    status: string;
  }
  type ScreenOptions = Partial<{
    query?: string;
    source?: Twitter.Tweet;
  }>;

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
