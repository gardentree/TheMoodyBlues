import {expect} from "chai";
import {test} from "@libraries/silencer";

const template: Twitter.Tweet = {
  full_text: "ポケモンGO",
  entities: {
    urls: [{expanded_url: "https://www.pokemongo.jp/"}],
  },
};

describe("test", () => {
  describe("full_text", () => {
    it("when upper and upper", () => {
      expect(test(template, ["GO"])).to.deep.equal("ポケモンGO");
    });
    it("when upper and lower", () => {
      expect(test(template, ["go"])).to.deep.equal("ポケモンGO");
    });
    it("when lower and upper", () => {
      const tweet = Object.assign({}, template, {full_text: "ポケモンgo"});

      expect(test(tweet, ["GO"])).to.deep.equal("ポケモンgo");
    });
    it("when lower and lower", () => {
      const tweet = Object.assign({}, template, {full_text: "ポケモンgo"});

      expect(test(tweet, ["go"])).to.deep.equal("ポケモンgo");
    });
  });

  describe("url", () => {
    it("when lower and lower", () => {
      expect(test(template, ["pokemon"])).to.deep.equal("https://www.pokemongo.jp/");
    });
    it("when lower and upper", () => {
      expect(test(template, ["POKEMON"])).to.deep.equal("https://www.pokemongo.jp/");
    });
    it("when upper and lower", () => {
      const tweet = Object.assign({}, template, {
        entities: {
          urls: [{expanded_url: "HTTPS://WWW.POKEMONGO.JP/"}],
        },
      });

      expect(test(tweet, ["pokemon"])).to.deep.equal("HTTPS://WWW.POKEMONGO.JP/");
    });
    it("when upper and upper", () => {
      const tweet = Object.assign({}, template, {
        entities: {
          urls: [{expanded_url: "HTTPS://WWW.POKEMONGO.JP/"}],
        },
      });

      expect(test(tweet, ["pokemon"])).to.deep.equal("HTTPS://WWW.POKEMONGO.JP/");
    });
  });

  describe("no match", () => {
    expect(test(template, ["GOGO"])).to.deep.equal(null);
  });
});
