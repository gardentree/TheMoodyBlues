import {expect} from "chai";
import {silence, test} from "@libraries/silencer";
import * as fs from "fs";

const tweetTemplate: Twitter.Tweet = {
  full_text: "ポケモンGO",
  entities: {
    urls: [{expanded_url: "https://www.pokemongo.jp/"}],
  },
  user: {
    id_str: "123456789",
    screen_name: "gian",
  },
};
const preferenceTemplate: TMB.MutePreference = {
  keywords: [],
  selfRetweet: false,
  media: [],
};

describe("silence", () => {
  describe("media", () => {
    it("don't have media", () => {
      const tweet = Object.assign({}, tweetTemplate, {entities: {media: []}});
      const preference = Object.assign({}, preferenceTemplate, {media: ["gian"]});

      expect(silence([tweet], preference)).to.deep.equal([tweet]);
    });
    it("have media", () => {
      const tweet = Object.assign({}, tweetTemplate, {entities: {media: [{}]}});
      const preference = Object.assign({}, preferenceTemplate, {media: ["gian"]});

      expect(silence([tweet], preference)).to.deep.equal([]);
    });
  });

  describe("self retweet", () => {
    it("when self retweet", () => {
      const tweet = Object.assign({}, tweetTemplate, {
        retweeted_status: {
          user: {
            id_str: "123456789",
          },
        },
      });
      const preference = Object.assign({}, preferenceTemplate, {selfRetweet: true});

      expect(silence([tweet], preference)).to.deep.equal([]);
    });

    it("when others retweet", () => {
      const tweet = Object.assign({}, tweetTemplate, {
        retweeted_status: {
          user: {
            id_str: "000000000",
          },
        },
      });
      const preference = Object.assign({}, preferenceTemplate, {selfRetweet: true});

      expect(silence([tweet], preference)).to.deep.equal([tweet]);
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
              id_str: "123456789",
            },
          },
        },
      });
      const preference = Object.assign({}, preferenceTemplate, {retweetReaction: ["123456789"]});

      expect(silence([tweet], preference)).to.deep.equal([]);
    });
  });
});

describe("test", () => {
  describe("full_text", () => {
    it("when upper and upper", () => {
      expect(test(tweetTemplate, ["GO"])).to.deep.equal("ポケモンGO");
    });
    it("when upper and lower", () => {
      expect(test(tweetTemplate, ["go"])).to.deep.equal("ポケモンGO");
    });
    it("when lower and upper", () => {
      const tweet = Object.assign({}, tweetTemplate, {full_text: "ポケモンgo"});

      expect(test(tweet, ["GO"])).to.deep.equal("ポケモンgo");
    });
    it("when lower and lower", () => {
      const tweet = Object.assign({}, tweetTemplate, {full_text: "ポケモンgo"});

      expect(test(tweet, ["go"])).to.deep.equal("ポケモンgo");
    });

    it("when retweet", () => {
      const tweet = JSON.parse(fs.readFileSync("./test/renderer/libraries/silencer/retweet.json"));

      expect(test(tweet, ["here"])).to.not.be.null;
    });
    it("when quote tweet", () => {
      const tweet = JSON.parse(fs.readFileSync("./test/renderer/libraries/silencer/quote.json"));

      expect(test(tweet, ["Friendly"])).to.not.be.null;
    });
  });

  describe("url", () => {
    it("when lower and lower", () => {
      expect(test(tweetTemplate, ["pokemon"])).to.deep.equal("https://www.pokemongo.jp/");
    });
    it("when lower and upper", () => {
      expect(test(tweetTemplate, ["POKEMON"])).to.deep.equal("https://www.pokemongo.jp/");
    });
    it("when upper and lower", () => {
      const tweet = Object.assign({}, tweetTemplate, {
        entities: {
          urls: [{expanded_url: "HTTPS://WWW.POKEMONGO.JP/"}],
        },
      });

      expect(test(tweet, ["pokemon"])).to.deep.equal("HTTPS://WWW.POKEMONGO.JP/");
    });
    it("when upper and upper", () => {
      const tweet = Object.assign({}, tweetTemplate, {
        entities: {
          urls: [{expanded_url: "HTTPS://WWW.POKEMONGO.JP/"}],
        },
      });

      expect(test(tweet, ["pokemon"])).to.deep.equal("HTTPS://WWW.POKEMONGO.JP/");
    });
  });

  describe("no match", () => {
    expect(test(tweetTemplate, ["GOGO"])).to.deep.equal(null);
  });
});
