export const HOME: Omit<TMB.Backstage, "active"> = {
  identifier: "home",
  title: "Home",
  component: "Timeline",
  interval: 120,
  way: "retrieveTimeline",
  mute: true,
  growl: true,
};
export const SEARCH: Omit<TMB.Backstage, "active"> = {
  identifier: "search",
  title: "Search",
  component: "Search",
  interval: 60,
  way: "search",
  mute: false,
  growl: false,
};
export const MENTIONS: Omit<TMB.Backstage, "active"> = {
  identifier: "mentions",
  title: "Mentions",
  component: "Timeline",
  interval: 300,
  way: "retrieveMentions",
  mute: false,
  growl: true,
};
export const LIST: Omit<TMB.Backstage, "identifier" | "title" | "active"> = {
  component: "Timeline",
  interval: 120,
  way: "retrieveTimelineOfList",
  mute: true,
  growl: true,
};

export const BACKSTAGES = (() => {
  return {
    ids: [HOME, SEARCH, MENTIONS].map((backstage) => backstage.identifier),
    entities: [HOME, SEARCH, MENTIONS].reduce((previous, current) => {
      previous[current.identifier] = Object.assign({active: true}, current);
      return previous;
    }, {}),
  };
})();

export const EVERYONE = "@everyone";
export const GATEKEEPER: TMB.Gatekeeper = {
  passengers: {
    [EVERYONE]: {
      identifier: EVERYONE,
      name: "全員",
      taboos: {},
    },
  },
  checkedAt: Date.now(),
};
