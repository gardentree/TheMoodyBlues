import {faker} from "@faker-js/faker";
import * as DateUtility from "date-fns";

function buildScreen(specifics?: Partial<TMB.Screen>): TMB.Screen {
  return Object.assign(
    {
      identity: faker.helpers.unique(faker.datatype.uuid),
      tweets: [],
      mode: "tweet",
      lastReadID: "",
      status: {status: ""},
    },
    specifics
  );
}
function buildPreference(specifics?: Partial<TMB.Preference>): TMB.Preference {
  const identity = specifics?.identity || faker.helpers.unique(faker.datatype.uuid);

  return Object.assign(
    {
      identity: identity,
      screen: buildScreenPreference({identity}),
      mute: buildMutePreference(),
    },
    specifics
  );
}
function buildScreenPreference(specifics?: Partial<TMB.ScreenPreference>): TMB.ScreenPreference {
  let preference: TMB.ScreenPreference | null;
  switch (specifics?.identity) {
    case "home":
    case undefined:
      preference = {
        identity: "home",
        title: "Home",
        component: "Timeline",
        interval: 120,
        way: "retrieveTimeline",
        mute: true,
        growl: false,
        active: true,
      };
      break;
    case "search":
      preference = {
        identity: "search",
        title: "Search",
        component: "Search",
        interval: 60,
        way: "search",
        mute: false,
        growl: false,
        active: true,
      };
      break;
    case "mentions":
      preference = {
        identity: "mentions",
        title: "Mentions",
        component: "Timeline",
        interval: 300,
        way: "retrieveMentions",
        mute: false,
        growl: true,
        active: true,
      };
      break;
    default:
      preference = {
        identity: specifics!.identity!,
        title: "List",
        component: "Timeline",
        interval: 120,
        way: "retrieveTimelineOfList",
        mute: true,
        growl: false,
        active: true,
      };
  }

  return Object.assign(preference, specifics);
}
function buildMutePreference(specifics?: Partial<TMB.MutePreference>): TMB.MutePreference {
  return Object.assign(
    {
      keywords: [],
      retweetYourself: false,
      withMedia: [],
      retweetReaction: [],
    },
    specifics
  );
}
function buildTweet(specifics?: RecursivePartial<Twitter.Tweet>): Twitter.Tweet {
  const id_str = specifics?.id_str || faker.helpers.unique(faker.random.numeric);
  const full_text = specifics?.full_text || faker.lorem.lines();

  return Object.assign(
    {
      id: parseInt(id_str),
      id_str,
      full_text: full_text,
      user: {},
      display_text_range: [0, full_text.length],
      entities: buildEntities(specifics?.entities),
      created_at: DateUtility.format(faker.date.past(), "E MMM d H:m:s x yyyy"),
      in_reply_to_status_id_str: null,
      is_quote_status: false,
    } as Twitter.Tweet,
    specifics
  );
}
function buildEntities(specifics?: RecursivePartial<Twitter.Entities>): Twitter.Entities {
  return Object.assign(
    {
      user_mentions: [],
      urls: [],
      hashtags: [],
    } as Twitter.Entities,
    specifics
  );
}
export const builders = {
  buildScreen,
  buildPreference,
  buildScreenPreference,
  buildMutePreference,
  buildTweet,
  buildEntities,
};

export const recursiveObjectContaining = (source: unknown) => {
  if (source instanceof Object) {
    for (const [key, value] of Object.entries(source)) {
      source[key] = recursiveObjectContaining(value);
    }

    return expect.objectContaining(source);
  } else {
    return source;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fail = (message: any) => {
  throw new Error(message);
};
