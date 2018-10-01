import * as React from "react";
import {configure, shallow} from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";
import {expect} from "chai";

import TweetBody from "../../../../src/renderer/components/TweetBody/TweetBody";

configure({adapter: new Adapter()});

describe("<TweetBody />", () => {
  describe("remove quoted link", () => {
    it("with indices", () => {
      const json = {
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

      const wrapper = shallow(<TweetBody tweet={json} />);

      expect(wrapper.text()).to.equal("てすとぉ");
    });

    it("with quoted_status_permalink", () => {
      const json = {
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

      const wrapper = shallow(<TweetBody tweet={json} />);

      expect(wrapper.text()).to.equal("てすとぉ。");
    });

    it("with indices and quoted_status_permalink", () => {
      const json = {
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

      const wrapper = shallow(<TweetBody tweet={json} />);

      expect(wrapper.text()).to.equal("てすとぉ");
    });
  });
});
