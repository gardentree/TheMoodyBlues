type FormState = import("redux-form").FormState | Record<string, unknown>;

declare namespace TheMoodyBlues {
  interface State {
    screens: NormalizedScreen;
    principal: Principal;
    backstages: NormalizedBackstage;
    gatekeeper: Gatekeeper;
    lineage: NormalizedLineage;
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

  type NormalizedLineage = EntityState<Lineage>;
  interface Lineage {
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
  interface DialogWithPreferences {
    type: "preferences";
  }
  type Dialog = DialogWithGatekeeper | DialogWithPreferences | null;
}

interface Window {
  facade: TMB.Facade;
}
