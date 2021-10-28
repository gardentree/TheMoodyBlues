import {default as merger} from "./merger";

const {TheMoodyBlues} = window;

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

export function initialPreferences() {
  return [{...HOME}, {...SEARCH}, {...MENTIONS}];
}

export function merge(actives: TheMoodyBlues.Store.TimelinePreference[], lists: Twitter.List[]): TheMoodyBlues.Store.TimelinePreference[] {
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

export function overwrite(oldTimelineMap: TheMoodyBlues.Store.TimelineMap) {
  const newTimelineMap: TheMoodyBlues.Store.TimelineMap = new Map();

  for (const preference of TheMoodyBlues.storage.getTimelinePreferences()) {
    if (!preference.active) {
      continue;
    }

    const oldTimeline = oldTimelineMap.get(preference.identity);
    let newTimeline: TheMoodyBlues.Store.Timeline | null = null;
    if (oldTimeline) {
      newTimeline = merger(oldTimeline, {
        preference: preference,
      }) as TheMoodyBlues.Store.Timeline;
    } else {
      newTimeline = {
        preference: preference,
        tweets: [],
        state: {lastReadID: 0},
      };
    }

    newTimelineMap.set(preference.identity, newTimeline);
  }

  return newTimelineMap;
}
