import {faker} from "@faker-js/faker";
import {EVERYONE, GATEKEEPER} from "@source/shared/defaults";
import * as DateUtility from "date-fns";

const state = {
  buildScreen: (specifics?: Partial<TMB.Screen>): TMB.Screen => {
    return Object.assign(
      {
        identifier: faker.helpers.unique(faker.datatype.uuid),
        tweets: [],
        mode: "tweet",
        lastReadID: "",
        status: {status: ""},
      },
      specifics
    );
  },
};

const preference = {
  buildScreen: (specifics?: Partial<TMB.ScreenPreference>): TMB.ScreenPreference => {
    const identifier = specifics?.identifier || faker.helpers.unique(faker.datatype.uuid);

    let preference: TMB.ScreenPreference | null;
    switch (specifics?.identifier) {
      case "home":
      case undefined:
        preference = {
          identifier: "home",
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
          identifier: "search",
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
          identifier: "mentions",
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
          identifier: specifics!.identifier!,
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
  },
  buildGatekeeper: (specifics?: Partial<TMB.GatekeeperPreference> | TMB.PassengerPreference[]): TMB.GatekeeperPreference => {
    if (Array.isArray(specifics)) {
      return {passengers: convertRecord(specifics, "identifier"), checkedAt: Date.now()};
    } else {
      return Object.assign({}, GATEKEEPER, specifics);
    }
  },
  buildPassenger: (specifics?: Partial<TMB.PassengerPreference> | TMB.Taboo[]): TMB.PassengerPreference => {
    if (Array.isArray(specifics)) {
      return {
        identifier: EVERYONE,
        name: "everyone",
        taboos: convertRecord(specifics, "keyword"),
      };
    } else {
      return Object.assign(
        {
          identifier: EVERYONE,
          name: "everyone",
          taboos: {},
        },
        specifics
      );
    }
  },
  buildTaboo: (specifics?: Partial<TMB.Taboo>): TMB.Taboo => {
    return Object.assign(
      {
        keyword: faker.helpers.unique(faker.animal.cat),
        expireAt: 0,
      },
      specifics
    );
  },
};

const twitter = {
  buildTweet: (specifics?: RecursivePartial<Twitter.Tweet>): Twitter.Tweet => {
    const id_str = specifics?.id_str || faker.helpers.unique(faker.random.numeric, [16]);
    const full_text = specifics?.full_text || faker.lorem.lines();

    return Object.assign(
      {
        id: parseInt(id_str),
        id_str,
        full_text: full_text,
        user: {
          id_str: faker.helpers.unique(faker.random.numeric, [16]),
          profile_image_url_https: faker.internet.url(),
          screen_name: faker.lorem.word(),
        },
        display_text_range: [0, full_text.length],
        entities: twitter.buildEntities(specifics?.entities),
        created_at: DateUtility.format(faker.date.past(), "E MMM d H:m:s x yyyy"),
        in_reply_to_status_id_str: null,
        is_quote_status: false,
      } as Twitter.Tweet,
      specifics
    );
  },
  buildEntities: (specifics?: RecursivePartial<Twitter.Entities>): Twitter.Entities => {
    return Object.assign(
      {
        user_mentions: [],
        urls: [],
        hashtags: [],
      } as Twitter.Entities,
      specifics
    );
  },
};

export const builders = {
  state,
  preference,
  twitter,
};

export const convertRecord = <E>(entities: E[], key: string): Record<string, E> => {
  return Object.fromEntries(entities.map((entity) => [entity[key], entity]));
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
