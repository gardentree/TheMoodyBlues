declare namespace TheMoodyBlues {
  interface State {
    screens: NormalizedScreen;
    principal: Principal;
    backstages: NormalizedBackstage;
    gatekeeper: Gatekeeper;
    lineage: NormalizedLineage;
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
  interface DialogWithTaboo {
    type: "taboo";
    context: TweetMenu;
  }
  interface DialogWithPreferences {
    type: "preferences";
  }
  type Dialog = DialogWithTaboo | DialogWithPreferences | null;
}

interface Window {
  facade: TMB.Facade;
}
