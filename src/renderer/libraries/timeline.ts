import {default as merger} from "./merger";

const {facade} = window;

const HOME = {
  identity: "home",
  title: "Home",
  component: "Timeline",
  interval: 120,
  way: "retrieveTimeline",
  mute: true,
  growl: true,
};
const SEARCH = {
  identity: "search",
  title: "Search",
  component: "Search",
  interval: 60,
  way: "search",
  mute: false,
  growl: false,
};
const MENTIONS = {
  identity: "mentions",
  title: "Mentions",
  component: "Timeline",
  interval: 300,
  way: "retrieveMentions",
  mute: false,
  growl: true,
};
const LIST = {
  component: "Timeline",
  interval: 120,
  way: "retrieveTimelineOfList",
  mute: true,
  growl: true,
};

export function makeInitialTimeline(preference: TheMoodyBlues.Store.TimelinePreference): TheMoodyBlues.Store.Timeline {
  const keywords = facade.storage.getMuteKeywords();

  return {
    preference: preference,
    tweets: [],
    state: {
      lastReadID: "",
    },
    mute: {
      keywords: keywords,
      selfRetweet: true,
    },
  };
}
export function initialPreferences() {
  return [HOME, SEARCH, MENTIONS].map((template) => Object.assign({active: true}, template));
}

export function mixPreferences(actives: TheMoodyBlues.Store.TimelinePreference[], lists: Twitter.List[]): TheMoodyBlues.Store.TimelinePreference[] {
  const activeMap = new Map(actives.map((active) => [active.identity, Object.assign({active: true}, active)]));

  const timelines: TheMoodyBlues.Store.TimelinePreference[] = [];
  timelines.push(Object.assign({}, HOME, activeMap.get("home")));
  for (const list of lists) {
    const identity = `list_${list.id_str}`;
    timelines.push(Object.assign({}, LIST, {identity: identity, title: list.name, parameters: [list.id_str]}, activeMap.get(identity)));
  }
  timelines.push(Object.assign({}, SEARCH, activeMap.get("search")));
  timelines.push(Object.assign({}, MENTIONS, activeMap.get("mentions")));

  return timelines;
}

export function refreshPreferences(currentMap: TheMoodyBlues.Store.TimelineMap): TheMoodyBlues.Store.TimelineMap {
  const newMap: TheMoodyBlues.Store.TimelineMap = new Map();

  const keywords = facade.storage.getMuteKeywords();

  for (const preference of facade.storage.getTimelinePreferences()) {
    if (!preference.active) {
      continue;
    }

    const current = currentMap.get(preference.identity);
    let newTimeline: TheMoodyBlues.Store.Timeline | null = null;
    if (current) {
      newTimeline = merger(current, {
        preference: preference,
        mute: {
          keywords: keywords,
          selfRetweet: true,
        },
      }) as TheMoodyBlues.Store.Timeline;
    } else {
      newTimeline = makeInitialTimeline(preference);
    }

    newMap.set(preference.identity, newTimeline);
  }

  return newMap;
}
