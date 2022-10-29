import {guard, test} from "@libraries/gatekeeper";
import {EVERYONE} from "@source/shared/defaults";
import {builders} from "@test/helper";
import * as fs from "fs";

const tweetTemplate: Twitter.Tweet = builders.twitter.buildTweet({
  full_text: "ポケモンGO",
  entities: {
    urls: [{expanded_url: "https://www.pokemongo.jp/"}],
  },
  user: {
    id_str: "gian",
  },
});
const preferenceTemplate: TMB.GatekeeperPreference = builders.state.buildGatekeeperPreference();

describe(guard.name, () => {
  describe("withMedia", () => {
    it("don't have media", () => {
      const tweet = Object.assign({}, tweetTemplate, {entities: {media: []}});
      const preference = Object.assign({}, preferenceTemplate);
      preference.passengers[EVERYONE].withMedia = true;

      expect(guard([tweet], preference)).toEqual([tweet]);
    });
    it("have media", () => {
      const tweet = Object.assign({}, tweetTemplate, {entities: {media: [{}]}});
      const preference = Object.assign({}, preferenceTemplate);
      preference.passengers[EVERYONE].withMedia = true;

      expect(guard([tweet], preference)).toEqual([]);
    });
  });

  describe("self retweet", () => {
    it("when self retweet", () => {
      const tweet = Object.assign({}, tweetTemplate, {
        retweeted_status: {
          user: {
            id_str: "gian",
          },
        },
      });
      const preference = Object.assign({}, preferenceTemplate);
      preference.passengers[EVERYONE].retweetYourself = true;

      expect(guard([tweet], preference)).toEqual([]);
    });

    it("when others retweet", () => {
      const tweet = Object.assign({}, tweetTemplate, {
        retweeted_status: {
          user: {
            id_str: "000000000",
          },
        },
      });
      const preference = Object.assign({}, preferenceTemplate, {retweetYourself: true});

      expect(guard([tweet], preference)).toEqual([tweet]);
    });
  });

  describe("retweet reaction", () => {
    it("when retweet quote tweet to yourself", () => {
      const tweet = Object.assign({}, tweetTemplate, {
        retweeted_status: {
          user: {
            id_str: "000000000",
          },
          quoted_status: {
            user: {
              id_str: "gian",
            },
          },
        },
      });
      const preference = Object.assign({}, preferenceTemplate);
      preference.passengers[EVERYONE].retweetReaction = true;

      expect(guard([tweet], preference)).toEqual([]);
    });
  });
});

describe("test", () => {
  describe("full_text", () => {
    describe("use text", () => {
      it("when upper and upper", () => {
        expect(test(tweetTemplate, ["GO"])).toEqual("/GO/i in ポケモンGO");
      });
      it("when upper and lower", () => {
        expect(test(tweetTemplate, ["go"])).toEqual("/go/i in ポケモンGO");
      });
      it("when lower and upper", () => {
        const tweet = Object.assign({}, tweetTemplate, {full_text: "ポケモンgo"});

        expect(test(tweet, ["GO"])).toEqual("/GO/i in ポケモンgo");
      });
      it("when lower and lower", () => {
        const tweet = Object.assign({}, tweetTemplate, {full_text: "ポケモンgo"});

        expect(test(tweet, ["go"])).toEqual("/go/i in ポケモンgo");
      });

      it("when retweet", () => {
        const tweet = JSON.parse(fs.readFileSync("./test/renderer/libraries/gatekeeper/retweet.json").toString());

        expect(test(tweet, ["here"])).not.toBeNull();
      });
      it("when quote tweet", () => {
        const tweet = JSON.parse(fs.readFileSync("./test/renderer/libraries/gatekeeper/quote.json").toString());

        expect(test(tweet, ["Friendly"])).not.toBeNull();
      });
    });
    describe("use regex", () => {
      it("when matche whole", () => {
        expect(test(tweetTemplate, ["/^ポケモンGO$/"])).toEqual("/^ポケモンGO$/i in ポケモンGO");
      });
      it("when doesn't matche whole", () => {
        expect(test(tweetTemplate, ["/^GO$/"])).toBeNull();
      });
    });
  });

  describe("url", () => {
    it("when lower and lower", () => {
      expect(test(tweetTemplate, ["pokemon"])).toEqual("/pokemon/i in https://www.pokemongo.jp/");
    });
    it("when lower and upper", () => {
      expect(test(tweetTemplate, ["POKEMON"])).toEqual("/POKEMON/i in https://www.pokemongo.jp/");
    });
    it("when upper and lower", () => {
      const tweet = Object.assign({}, tweetTemplate, {
        entities: {
          urls: [{expanded_url: "HTTPS://WWW.POKEMONGO.JP/"}],
        },
      });

      expect(test(tweet, ["pokemon"])).toEqual("/pokemon/i in HTTPS://WWW.POKEMONGO.JP/");
    });
    it("when upper and upper", () => {
      const tweet = Object.assign({}, tweetTemplate, {
        entities: {
          urls: [{expanded_url: "HTTPS://WWW.POKEMONGO.JP/"}],
        },
      });

      expect(test(tweet, ["pokemon"])).toEqual("/pokemon/i in HTTPS://WWW.POKEMONGO.JP/");
    });
  });

  describe("no match", () => {
    expect(test(tweetTemplate, ["GOGO"])).toEqual(null);
  });
});
