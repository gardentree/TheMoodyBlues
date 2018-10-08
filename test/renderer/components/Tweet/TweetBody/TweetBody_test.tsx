import * as React from "react";
import {configure, shallow} from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";
import {expect} from "chai";
import * as twitter from "../../../../../src/renderer/others/twitter";

import TweetBody from "../../../../../src/renderer/components/Tweet/TweetBody/TweetBody";

configure({adapter: new Adapter()});

describe("<TweetBody />", () => {
  describe("with mention", () => {
    it("expand", () => {
      // @ts-ignore
      const json: twitter.Tweet = {
        full_text: "@foo てすとぉ",
        display_text_range: [5, 9],
        entities: {
          user_mentions: [
            {
              indices: [0, 4],
            },
          ],
          urls: [],
        },
      };

      const wrapper = shallow(<TweetBody tweet={json} expand={true} />);
      expect(wrapper.text()).to.equal("<Connect(UserIdentifier) /> てすとぉ");
    });
  });

  describe("with indices", () => {
    // @ts-ignore
    const json: twitter.Tweet = {
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
    };

    it("expand", () => {
      const wrapper = shallow(<TweetBody tweet={json} expand={true} />);

      expect(wrapper.text()).to.equal("てすとぉ ");
    });
    it("collapse", () => {
      const wrapper = shallow(<TweetBody tweet={json} />);

      expect(wrapper.text()).to.equal("てすとぉ <ExternalLink />");
    });
  });

  describe("with quoted_status_permalink", () => {
    // @ts-ignore
    const json: twitter.Tweet = {
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
    };

    it("expand", () => {
      const wrapper = shallow(<TweetBody tweet={json} expand={true} />);

      expect(wrapper.text()).to.equal("てすとぉ。");
    });
    it("collapse", () => {
      const wrapper = shallow(<TweetBody tweet={json} />);

      expect(wrapper.text()).to.equal("てすとぉ。<ExternalLink />");
    });
  });

  describe("with indices and quoted_status_permalink", () => {
    // @ts-ignore
    const json: twitter.Tweet = {
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
    };

    it("expand", () => {
      const wrapper = shallow(<TweetBody tweet={json} expand={true} />);

      expect(wrapper.text()).to.equal("てすとぉ ");
    });
    it("collapse", () => {
      const wrapper = shallow(<TweetBody tweet={json} />);

      expect(wrapper.text()).to.equal("てすとぉ <ExternalLink />");
    });
  });
});
