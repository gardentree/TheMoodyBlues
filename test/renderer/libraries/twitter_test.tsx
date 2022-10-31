import {parseElements} from "@libraries/twitter";
import {builders} from "@test/helper";

describe(parseElements, () => {
  describe("with mention", () => {
    it("expand", () => {
      const tweet = builders.twitter.buildTweet({
        full_text: "@foo てすとぉ",
        display_text_range: [5, 9],
        entities: {
          user_mentions: [
            {
              indices: [0, 4],
            },
          ],
        },
      });

      expect(parseElements(tweet, true)).toEqual([
        {
          entity: {indices: [0, 4]},
          type: "user_mentions",
        },
        {entity: " てすとぉ", type: "string"},
      ]);
    });
  });

  describe("with indices", () => {
    const tweet = builders.twitter.buildTweet({
      full_text: "てすとぉ https://t.co/test",
      display_text_range: [0, 4],
      entities: {
        urls: [
          {
            url: "https://t.co/test",
            expanded_url: "https://twitter.com/test",
            display_url: "twitter.com/test…",
            indices: [5, 23],
          },
        ],
      },
    });

    it("when expand", () => {
      expect(parseElements(tweet, true)).toEqual([{entity: "てすとぉ ", type: "string"}]);
    });
    it("when collapse", () => {
      expect(parseElements(tweet, false)).toEqual([{entity: "てすとぉ ", type: "string"}]);
    });
  });

  describe("with quoted_status_permalink", () => {
    const tweet = builders.twitter.buildTweet({
      full_text: "てすとぉ。https://t.co/UVKnxHf1IJ",
      display_text_range: [0, 28],
      entities: {
        urls: [
          {
            url: "https://t.co/test",
            expanded_url: "https://twitter.com/test",
            display_url: "twitter.com/test…",
            indices: [5, 28],
          },
        ],
      },
      quoted_status_permalink: {
        url: "https://t.co/test",
        expanded_url: "https://twitter.com/test",
        display_url: "twitter.com/test…",
      },
    });

    it("when expand", () => {
      expect(parseElements(tweet, true)).toEqual([{entity: "てすとぉ。", type: "string"}]);
    });
    it("when collapse", () => {
      expect(parseElements(tweet, false)).toEqual([
        {entity: "てすとぉ。", type: "string"},
        {
          entity: {
            display_url: "twitter.com/test…",
            expanded_url: "https://twitter.com/test",
            indices: [5, 28],
            url: "https://t.co/test",
          },
          type: "urls",
        },
      ]);
    });
  });

  describe("with indices and quoted_status_permalink", () => {
    const tweet = builders.twitter.buildTweet({
      full_text: "てすとぉ https://t.co/test",
      display_text_range: [0, 4],
      entities: {
        urls: [
          {
            url: "https://t.co/test",
            expanded_url: "https://twitter.com/test",
            display_url: "twitter.com/test…",
            indices: [5, 23],
          },
        ],
      },
      quoted_status_permalink: {
        url: "https://t.co/test",
        expanded_url: "https://twitter.com/test",
        display_url: "twitter.com/test…",
        indices: [5, 23],
      },
    });

    it("when expand", () => {
      expect(parseElements(tweet, true)).toEqual([{entity: "てすとぉ ", type: "string"}]);
    });
    it("when collapse", () => {
      expect(parseElements(tweet, false)).toEqual([{entity: "てすとぉ ", type: "string"}]);
    });
  });

  describe("media", () => {
    const tweet = builders.twitter.buildTweet({
      full_text: "てすとぉ。 https://t.co/test",
      display_text_range: [0, 5],
      entities: {
        media: [
          {
            indices: [5, 23],
            media_url_https: "https://pbs.twimg.com/media/test.jpg",
            display_url: "pic.twitter.com/test",
          },
        ],
      },
    });

    it("when expand", () => {
      expect(parseElements(tweet, true)).toEqual([
        {entity: "てすとぉ。", type: "string"},
        {
          entity: {
            display_url: "pic.twitter.com/test",
            indices: [5, 23],
            media_url_https: "https://pbs.twimg.com/media/test.jpg",
          },
          type: "media",
        },
      ]);
    });
    it("when collapse", () => {
      expect(parseElements(tweet, false)).toEqual([
        {entity: "てすとぉ。", type: "string"},
        {
          entity: {
            display_url: "pic.twitter.com/test",
            indices: [5, 23],
            media_url_https: "https://pbs.twimg.com/media/test.jpg",
          },
          type: "media",
        },
      ]);
    });
  });
});
