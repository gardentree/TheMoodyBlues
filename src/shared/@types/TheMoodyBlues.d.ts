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
    }
    interface Timeline {
      preference: TimelinePreference;
      tweets: Twitter.Tweet[];
      state: {
        lastReadID: string;
        query?: string;
      };
      mute: MutePreference;
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
    interface MutePreference {
      keywords: string[];
      selfRetweet: boolean;
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
    get(path: string, parameters: any): Promise<Twitter2.Response>;

    retrieveTimeline(since_id: string | null): Promise<Twitter.Tweet[]>;
    search(query: string, since_id: string | null): Promise<Twitter.Tweet[]>;
    retrieveTimelineOfUser(name: string): Promise<Twitter.Tweet[]>;
    retrieveMentions(since_id: string | null): Promise<Twitter.Tweet[]>;
    retrieveConversation(criterion: Twitter.Tweet): Promise<Twitter.Tweet[]>;
    lists(): Promise<Twitter.List[]>;
    retrieveTimelineOfList(list_id: string, since_id: string | null): Promise<Twitter.Tweet[]>;
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
  facade: Facade;
}
interface Facade {
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
  growl: any;
  openTweetMenu: any;
  openExternal: any;
  logger: any;
  ipc: {
    observe(event: string, callback: (event: Event, ...values: any[]) => void);
    action(action: string, ...values: any[]);
    call(action: string, ...values: any[]);
  };
  extra: any;
}

declare module "growly" {
  declare function notify(any, any);
}
