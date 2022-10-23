import {silence, test} from "@libraries/silencer";
import {builders} from "@test/helper";
import * as fs from "fs";

const tweetTemplate: Twitter.Tweet = builders.buildTweet({
  full_text: "ポケモンGO",
  entities: {
    urls: [{expanded_url: "https://www.pokemongo.jp/"}],
  },
  user: {
    id_str: "gian",
  },
});
const preferenceTemplate: TMB.MutePreference = builders.buildMutePreference({
  keywords: [],
  retweetYourself: false,
  withMedia: [],
});

describe("silence", () => {
  describe("withMedia", () => {
    it("don't have media", () => {
      const tweet = Object.assign({}, tweetTemplate, {entities: {media: []}});
      const preference = Object.assign({}, preferenceTemplate, {withMedia: ["gian"]});

      expect(silence([tweet], preference)).toEqual([tweet]);
    });
    it("have media", () => {
      const tweet = Object.assign({}, tweetTemplate, {entities: {media: [{}]}});
      const preference = Object.assign({}, preferenceTemplate, {withMedia: ["gian"]});

      expect(silence([tweet], preference)).toEqual([]);
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
      const preference = Object.assign({}, preferenceTemplate, {retweetYourself: true});

      expect(silence([tweet], preference)).toEqual([]);
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

      expect(silence([tweet], preference)).toEqual([tweet]);
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
      const preference = Object.assign({}, preferenceTemplate, {retweetReaction: ["gian"]});

      expect(silence([tweet], preference)).toEqual([]);
    });
  });
});

describe("test", () => {
  describe("full_text", () => {
    describe("use text", () => {
      it("when upper and upper", () => {
        expect(test(tweetTemplate, ["GO"])).toEqual("ポケモンGO");
      });
      it("when upper and lower", () => {
        expect(test(tweetTemplate, ["go"])).toEqual("ポケモンGO");
      });
      it("when lower and upper", () => {
        const tweet = Object.assign({}, tweetTemplate, {full_text: "ポケモンgo"});

        expect(test(tweet, ["GO"])).toEqual("ポケモンgo");
      });
      it("when lower and lower", () => {
        const tweet = Object.assign({}, tweetTemplate, {full_text: "ポケモンgo"});

        expect(test(tweet, ["go"])).toEqual("ポケモンgo");
      });

      it("when retweet", () => {
        const tweet = JSON.parse(fs.readFileSync("./test/renderer/libraries/silencer/retweet.json").toString());

        expect(test(tweet, ["here"])).not.toBeNull();
      });
      it("when quote tweet", () => {
        const tweet = JSON.parse(fs.readFileSync("./test/renderer/libraries/silencer/quote.json").toString());

        expect(test(tweet, ["Friendly"])).not.toBeNull();
      });
    });
    describe("use regex", () => {
      it("when matche whole", () => {
        expect(test(tweetTemplate, ["/^ポケモンGO$/"])).toEqual("ポケモンGO");
      });
      it("when doesn't matche whole", () => {
        expect(test(tweetTemplate, ["/^GO$/"])).toBeNull();
      });
    });
  });

  describe("url", () => {
    it("when lower and lower", () => {
      expect(test(tweetTemplate, ["pokemon"])).toEqual("https://www.pokemongo.jp/");
    });
    it("when lower and upper", () => {
      expect(test(tweetTemplate, ["POKEMON"])).toEqual("https://www.pokemongo.jp/");
    });
    it("when upper and lower", () => {
      const tweet = Object.assign({}, tweetTemplate, {
        entities: {
          urls: [{expanded_url: "HTTPS://WWW.POKEMONGO.JP/"}],
        },
      });

      expect(test(tweet, ["pokemon"])).toEqual("HTTPS://WWW.POKEMONGO.JP/");
    });
    it("when upper and upper", () => {
      const tweet = Object.assign({}, tweetTemplate, {
        entities: {
          urls: [{expanded_url: "HTTPS://WWW.POKEMONGO.JP/"}],
        },
      });

      expect(test(tweet, ["pokemon"])).toEqual("HTTPS://WWW.POKEMONGO.JP/");
    });
  });

  describe("no match", () => {
    expect(test(tweetTemplate, ["GOGO"])).toEqual(null);
  });
});
