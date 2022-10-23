import * as React from "react";
import {configure, shallow, render} from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";

import TweetBody from "@source/renderer/components/Tweet/TweetBody/component";
import {builders, fail} from "@test/helper";

configure({adapter: new Adapter()});

describe("<TweetBody />", () => {
  describe("with mention", () => {
    it("expand", () => {
      const json = builders.twitter.buildTweet({
        full_text: "@foo てすとぉ",
        display_text_range: [5, 9],
        entities: builders.twitter.buildEntities({
          user_mentions: [
            {
              indices: [0, 4],
            },
          ],
          urls: [],
        }),
      });

      const wrapper = shallow(<TweetBody tweet={json} expand={true} search={fail} />);
      expect(wrapper.text()).toBe(" てすとぉ");
    });
  });

  describe("with indices", () => {
    const json = builders.twitter.buildTweet({
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

    it("expand", () => {
      const wrapper = shallow(<TweetBody tweet={json} expand={true} search={fail} />);

      expect(wrapper.text()).toBe("てすとぉ ");
    });
    it("collapse", () => {
      const wrapper = shallow(<TweetBody tweet={json} search={fail} />);

      expect(wrapper.text()).toBe("てすとぉ ");
    });
  });

  describe("with quoted_status_permalink", () => {
    const json = builders.twitter.buildTweet({
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

    it("expand", () => {
      const wrapper = shallow(<TweetBody tweet={json} expand={true} search={fail} />);

      expect(wrapper.text()).toBe("てすとぉ。");
    });
    it("collapse", () => {
      const wrapper = shallow(<TweetBody tweet={json} search={fail} />);

      expect(wrapper.text()).toBe("てすとぉ。<ExternalLink />");
    });
  });

  describe("with indices and quoted_status_permalink", () => {
    const json = builders.twitter.buildTweet({
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

    it("expand", () => {
      const wrapper = shallow(<TweetBody tweet={json} expand={true} search={fail} />);

      expect(wrapper.text()).toBe("てすとぉ ");
    });
    it("collapse", () => {
      const wrapper = shallow(<TweetBody tweet={json} search={fail} />);

      expect(wrapper.text()).toBe("てすとぉ ");
    });
  });

  describe("media", () => {
    const json = builders.twitter.buildTweet({
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

    it("expand", () => {
      const wrapper = render(<TweetBody tweet={json} expand={true} search={fail} />);

      expect(wrapper.text()).toBe("てすとぉ。");
    });
    it("collapse", () => {
      const wrapper = render(<TweetBody tweet={json} search={fail} />);

      expect(wrapper.text()).toBe("てすとぉ。pic.twitter.com/test");
    });
  });
});
