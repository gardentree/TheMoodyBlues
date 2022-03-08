export const HOME: Omit<TMB.ScreenPreference, "active"> = {
  identity: "home",
  title: "Home",
  component: "Timeline",
  interval: 120,
  way: "retrieveTimeline",
  mute: true,
  growl: true,
};
export const SEARCH: Omit<TMB.ScreenPreference, "active"> = {
  identity: "search",
  title: "Search",
  component: "Search",
  interval: 60,
  way: "search",
  mute: false,
  growl: false,
};
export const MENTIONS: Omit<TMB.ScreenPreference, "active"> = {
  identity: "mentions",
  title: "Mentions",
  component: "Timeline",
  interval: 300,
  way: "retrieveMentions",
  mute: false,
  growl: true,
};
export const LIST: Omit<TMB.ScreenPreference, "identity" | "title" | "active"> = {
  component: "Timeline",
  interval: 120,
  way: "retrieveTimelineOfList",
  mute: true,
  growl: true,
};

export const MUTE: TMB.MutePreference = {
  keywords: [],
  retweetYourself: false,
  withMedia: [],
  retweetReaction: [],
};
