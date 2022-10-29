export const HOME: Omit<TMB.ScreenPreference, "active"> = {
  identifier: "home",
  title: "Home",
  component: "Timeline",
  interval: 120,
  way: "retrieveTimeline",
  mute: true,
  growl: true,
};
export const SEARCH: Omit<TMB.ScreenPreference, "active"> = {
  identifier: "search",
  title: "Search",
  component: "Search",
  interval: 60,
  way: "search",
  mute: false,
  growl: false,
};
export const MENTIONS: Omit<TMB.ScreenPreference, "active"> = {
  identifier: "mentions",
  title: "Mentions",
  component: "Timeline",
  interval: 300,
  way: "retrieveMentions",
  mute: false,
  growl: true,
};
export const LIST: Omit<TMB.ScreenPreference, "identifier" | "title" | "active"> = {
  component: "Timeline",
  interval: 120,
  way: "retrieveTimelineOfList",
  mute: true,
  growl: true,
};

export const EVERYONE = "@everyone";
export const GATEKEEPER: TMB.GatekeeperPreference = {
  passengers: {
    [EVERYONE]: {
      identifier: EVERYONE,
      name: "全員",
      taboos: {},
    },
  },
  checkedAt: Date.now(),
};
