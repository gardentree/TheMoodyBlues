const {facade} = window;

const HOME: Omit<TheMoodyBlues.TimelinePreference, "active"> = {
  identity: "home",
  title: "Home",
  component: "Timeline",
  interval: 120,
  way: "retrieveTimeline",
  mute: true,
  growl: true,
};
const SEARCH: Omit<TheMoodyBlues.TimelinePreference, "active"> = {
  identity: "search",
  title: "Search",
  component: "Search",
  interval: 60,
  way: "search",
  mute: false,
  growl: false,
};
const MENTIONS: Omit<TheMoodyBlues.TimelinePreference, "active"> = {
  identity: "mentions",
  title: "Mentions",
  component: "Timeline",
  interval: 300,
  way: "retrieveMentions",
  mute: false,
  growl: true,
};
const LIST: Omit<TheMoodyBlues.TimelinePreference, "identity" | "title" | "active"> = {
  component: "Timeline",
  interval: 120,
  way: "retrieveTimelineOfList",
  mute: true,
  growl: true,
};

export const INITIAL_VALUE: TheMoodyBlues.Timeline = {
  tweets: [],
  mode: "tweet",
  state: {
    lastReadID: "",
  },
};

export async function loadPreferences(): Promise<TheMoodyBlues.PreferenceMap> {
  const timelines = (await facade.storage.getTimelinePreferences()) || initialPreferences();
  const mute: TheMoodyBlues.MutePreference = Object.assign(
    {
      keywords: [],
      selfRetweet: false,
      media: [],
    },
    await facade.storage.getMutePreference()
  );

  return new Map(timelines.map((timeline) => [timeline.identity, {identity: timeline.identity, timeline, mute}]));
}

function initialPreferences(): TheMoodyBlues.TimelinePreference[] {
  return [HOME, SEARCH, MENTIONS].map((template) => Object.assign({active: true}, template));
}

export function mixPreferences(actives: TheMoodyBlues.TimelinePreference[], lists: Twitter.List[]): TheMoodyBlues.TimelinePreference[] {
  const activeMap = new Map(actives.map((active) => [active.identity, Object.assign({active: true}, active)]));

  const timelines: TheMoodyBlues.TimelinePreference[] = [];
  timelines.push(Object.assign({}, HOME, activeMap.get("home")));
  for (const list of lists) {
    const identity = `list_${list.id_str}`;
    timelines.push(Object.assign({}, LIST, {identity: identity, title: list.name, parameters: [list.id_str]}, activeMap.get(identity)));
  }
  timelines.push(Object.assign({}, SEARCH, activeMap.get("search")));
  timelines.push(Object.assign({}, MENTIONS, activeMap.get("mentions")));

  return timelines;
}
