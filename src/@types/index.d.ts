namespace TheMoodyBlues {
  interface State {
    home: HomeState;
    account: any;
  }

  interface HomeState {
    tab: string;
    timelines: Map<string, Timeline>;
    subcontents: any;
    style: {
      fontSize: string;
    };
    nowLoading: boolean;
  }
  interface Timeline {
    meta: {
      identity: string;
      title: string;
      component: "Timeline" | "Search";
      interval: number;
      way: "timeline" | "search" | "mentionsTimeline";
    };
    tweets: TweetType[];
    state: {
      lastReadID: number;
      query?: string;
    };
  }

  interface HomeAction {
    type: string;
    payload?: {identity: string};
    meta: any | null;
    error: any;
  }
}
