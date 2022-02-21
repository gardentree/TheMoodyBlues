const {facade} = window;

const HOME: Omit<TMB.TimelinePreference, "active"> = {
  identity: "home",
  title: "Home",
  component: "Timeline",
  interval: 120,
  way: "retrieveTimeline",
  mute: true,
  growl: true,
};
const SEARCH: Omit<TMB.TimelinePreference, "active"> = {
  identity: "search",
  title: "Search",
  component: "Search",
  interval: 60,
  way: "search",
  mute: false,
  growl: false,
};
const MENTIONS: Omit<TMB.TimelinePreference, "active"> = {
  identity: "mentions",
  title: "Mentions",
  component: "Timeline",
  interval: 300,
  way: "retrieveMentions",
  mute: false,
  growl: true,
};
const LIST: Omit<TMB.TimelinePreference, "identity" | "title" | "active"> = {
  component: "Timeline",
  interval: 120,
  way: "retrieveTimelineOfList",
  mute: true,
  growl: true,
};

export const INITIAL_VALUE: TMB.Timeline = {
  tweets: [],
  mode: "tweet",
  state: {
    lastReadID: "",
  },
};

export async function loadPreferences(): Promise<TMB.PreferenceMap> {
  const timelines = (await facade.storage.getTimelinePreferences()) || initialPreferences();
  const mute: TMB.MutePreference = Object.assign(
    {
      keywords: [],
      selfRetweet: false,
      media: [],
    },
    await facade.storage.getMutePreference()
  );

  return new Map(timelines.map((timeline) => [timeline.identity, {identity: timeline.identity, timeline, mute}]));
}

function initialPreferences(): TMB.TimelinePreference[] {
  return [HOME, SEARCH, MENTIONS].map((template) => Object.assign({active: true}, template));
}

export function mixPreferences(actives: TMB.TimelinePreference[], lists: Twitter.List[]): TMB.TimelinePreference[] {
  const activeMap = new Map(actives.map((active) => [active.identity, Object.assign({active: true}, active)]));

  const timelines: TMB.TimelinePreference[] = [];
  timelines.push(Object.assign({}, HOME, activeMap.get("home")));
  for (const list of lists) {
    const identity = `list_${list.id_str}`;
    timelines.push(Object.assign({}, LIST, {identity: identity, title: list.name, parameters: [list.id_str]}, activeMap.get(identity)));
  }
  timelines.push(Object.assign({}, SEARCH, activeMap.get("search")));
  timelines.push(Object.assign({}, MENTIONS, activeMap.get("mentions")));

  return timelines;
}
