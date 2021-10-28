namespace TheMoodyBlues {
  namespace Store {
    interface State {
      agent: TwitterAgent;
      preference: Preference;
      timelines: TimelineMap;
      subcontents: SubContents;
      principal: Principal;
    }
    type TimelineIdentity = string;
    type TimelineMap = Map<TimelineIdentity, Timeline>;
    interface Preference {
      timelines: PreferenceMap;
      mute_keywords: string[];
    }
    interface Timeline {
      preference: TimelinePreference;
      tweets: TweetType[];
      state: {
        lastReadID: string;
        query?: string;
      };
    }
    interface TimelinePreference {
      identity: TimelineIdentity;
      title: string;
      component: "Timeline" | "Search";
      interval: number;
      way: "retrieveTimeline" | "search" | "retrieveMentions" | "retrieveTimelineOfList";
      parameters?: any[];
      active: boolean;
      growl: boolean;
      mute: boolean;
    }
    type SubContents = any;

    interface Principal {
      focused: TimelineIdentity;
      nowLoading: boolean;
      style: {
        fontSize: string;
      };
    }
  }

  interface HomeAction {
    type: string;
    payload?: {identity: TimelineIdentity};
    meta: any | null;
    error: any;
  }
}
