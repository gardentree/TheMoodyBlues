namespace TheMoodyBlues {
  namespace Store {
    interface State {
      agent: TheMoodyBlues.TwitterAgent;
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
      tweets: Twitter.Tweet[];
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

  interface TwitterAgent {
    timeline(since_id: string | null): Twitter.Tweet[];
    search(query: string, since_id: string | null): Twitter.Tweet[];
    retrieveTimelineOfUser(name: string): Twitter.Tweet[];
    retrieveMentions(since_id: string | null): Twitter.Tweet[];
    retrieveConversation(criterion: Twitter.Tweet): Twitter.Tweet[];
    lists(): Promise<Twitter.List[]>;
    retrieveTimelineOfList(list_id: string, since_id: string | null): Twitter.Tweet[];
  }

  interface ReduxAction {
    type: string;
    payload?: any;
    meta?: any;
    error?: any;
  }

  interface TweetMenu {
    tweet: Twitter.Tweet;
    keyword: string;
  }
}

interface Window {
  TheMoodyBlues: {
    storage: {
      getAccessKey(): string;
      setAccessKey(value: string);
      getAccessSecret(): string;
      setAccessSecret(value: string);
      getMuteKeywords(): string[];
      setMuteKeywords(keywords: string[]);
      getTimelinePreferences(): TheMoodyBlues.Store.TimelinePreference[];
      setTimelinePreferences(timelines: TheMoodyBlues.Store.TimelinePreference[]);
      getTweets(name: string);
      setTweets(name: string, tweets: Twitter.Tweet[]);
    };
    agent: {
      authorize(showVerifierForm: () => Promise<string>): Promise<TheMoodyBlues.TwitterAgent>;
      call(): TheMoodyBlues.TwitterAgent | null;
    };
    keybinds: any;
    growl: any;
    openTweetMenu: any;
    openExternal: any;
    logger: any;
  };
}

declare module "growly" {
  declare function notify(any, any);
}
