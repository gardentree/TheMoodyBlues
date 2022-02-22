const {facade} = window;

const HOME: Omit<TMB.ScreenPreference, "active"> = {
  identity: "home",
  title: "Home",
  component: "Timeline",
  interval: 120,
  way: "retrieveTimeline",
  mute: true,
  growl: true,
};
const SEARCH: Omit<TMB.ScreenPreference, "active"> = {
  identity: "search",
  title: "Search",
  component: "Search",
  interval: 60,
  way: "search",
  mute: false,
  growl: false,
};
const MENTIONS: Omit<TMB.ScreenPreference, "active"> = {
  identity: "mentions",
  title: "Mentions",
  component: "Timeline",
  interval: 300,
  way: "retrieveMentions",
  mute: false,
  growl: true,
};
const LIST: Omit<TMB.ScreenPreference, "identity" | "title" | "active"> = {
  component: "Timeline",
  interval: 120,
  way: "retrieveTimelineOfList",
  mute: true,
  growl: true,
};

export const INITIAL_VALUE: TMB.Screen = {
  tweets: [],
  mode: "tweet",
  lastReadID: "",
};

export async function loadPreferences(): Promise<TMB.PreferenceMap> {
  const screens = (await facade.storage.getScreenPreferences()) || initialPreferences();
  const mute: TMB.MutePreference = Object.assign(
    {
      keywords: [],
      selfRetweet: false,
      media: [],
    },
    await facade.storage.getMutePreference()
  );

  return new Map(screens.map((screen) => [screen.identity, {identity: screen.identity, screen, mute}]));
}

function initialPreferences(): TMB.ScreenPreference[] {
  return [HOME, SEARCH, MENTIONS].map((template) => Object.assign({active: true}, template));
}

export function mixPreferences(actives: TMB.ScreenPreference[], lists: Twitter.List[]): TMB.ScreenPreference[] {
  const activeMap = new Map(actives.map((active) => [active.identity, Object.assign({active: true}, active)]));

  const screens: TMB.ScreenPreference[] = [];
  screens.push(Object.assign({}, HOME, activeMap.get("home")));
  for (const list of lists) {
    const identity = `list_${list.id_str}`;
    screens.push(Object.assign({}, LIST, {identity: identity, title: list.name, parameters: [list.id_str]}, activeMap.get(identity)));
  }
  screens.push(Object.assign({}, SEARCH, activeMap.get("search")));
  screens.push(Object.assign({}, MENTIONS, activeMap.get("mentions")));

  return screens;
}
