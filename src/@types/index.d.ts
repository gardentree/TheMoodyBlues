namespace TheMoodyBlues {
  interface State {
    home: HomeState;
    agent: TwitterAgent;
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
    preference: TimelinePreference;
    tweets: TweetType[];
    state: {
      lastReadID: number;
      query?: string;
    };
  }
  interface TimelinePreference {
    identity: string;
    title: string;
    component: "Timeline" | "Search";
    interval: number;
    way: "retrieveTimeline" | "search" | "retrieveMentions" | "retrieveTimelineOfList";
    parameters?: any[];
  }

  interface HomeAction {
    type: string;
    payload?: {identity: string};
    meta: any | null;
    error: any;
  }
}
