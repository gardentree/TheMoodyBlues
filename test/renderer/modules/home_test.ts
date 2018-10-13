import {expect} from "chai";
import {default as reducer} from "../../../src/renderer/modules/home";
import * as home from "../../../src/renderer/modules/home";

const template = {
  tab: null,
  contents: {},
  subcontents: {},
  style: {
    fontSize: "12px",
  },
};

describe(reducer.name, () => {
  it("selectTab", () => {
    expect(reducer(undefined, home.selectTab("abc"))).to.deep.equal({
      tab: "abc",
      contents: {},
      subcontents: {},
      style: {
        fontSize: "12px",
      },
    });
  });

  it("updateTweets", () => {
    expect(reducer({...template, contents: {a: {tweets: []}}}, home.updateTweets([], "b"))).to.deep.equal({
      contents: {
        a: {tweets: []},
        b: {tweets: []},
      },
      tab: null,
      subcontents: {},
      style: {
        fontSize: "12px",
      },
    });
  });
  it(home.updateTweets.toString(), () => {
    expect(
      reducer(
        {
          ...template,
          tab: "a",
          contents: {
            a: {
              tweets: [{id: 1}],
              lastReadID: 0,
            },
          },
        },
        home.updateTweets([{id: 2}, {id: 1}], "a")
      )
    ).to.deep.equal({
      tab: "a",
      contents: {
        a: {
          tweets: [{id: 2}, {id: 1}],
          lastReadID: 0,
        },
      },
      subcontents: {},
      style: {
        fontSize: "12px",
      },
    });
  });

  it("updateTweetsInSubContents", () => {
    expect(reducer(undefined, home.updateTweetsInSubContents([]))).to.deep.equal({
      tab: null,
      contents: {},
      subcontents: {tweets: []},
      style: {
        fontSize: "12px",
      },
    });
  });

  it(home.read.toString(), () => {
    expect(
      reducer(
        {
          ...template,
          tab: "a",
          contents: {
            a: {
              tweets: [{id: 1}],
              lastReadID: 0,
            },
          },
        },
        home.read(1)
      )
    ).to.deep.equal({
      tab: "a",
      contents: {
        a: {
          tweets: [{id: 1}],
          lastReadID: 1,
        },
      },
      subcontents: {},
      style: {
        fontSize: "12px",
      },
    });
  });

  it("zoomIn", () => {
    expect(reducer({...template, style: {fontSize: "10px"}}, home.zoomIn())).to.deep.equal({
      style: {
        fontSize: "11px",
      },
      contents: {},
      subcontents: {},
      tab: null,
    });
  });
  it("zoomOut", () => {
    expect(reducer({...template, style: {fontSize: "10px"}}, home.zoomOut())).to.deep.equal({
      style: {
        fontSize: "9px",
      },
      contents: {},
      subcontents: {},
      tab: null,
    });
  });
  it("zoomReset", () => {
    expect(reducer({...template, style: {fontSize: "10px"}}, home.zoomReset())).to.deep.equal({
      style: {
        fontSize: "12px",
      },
      contents: {},
      subcontents: {},
      tab: null,
    });
  });

  describe(home.setupSearch.toString(), () => {
    it("compile", () => {
      expect(reducer(template, home.setupSearch("くえりー"))).to.deep.equal({
        contents: {
          Search: {
            tweets: [],
            query: "くえりー",
          },
        },
        subcontents: {},
        tab: null,
        style: {fontSize: "12px"},
      });
    });
    it("trim query", () => {
      expect(reducer(template, home.setupSearch(" く え り ー "))).to.deep.equal({
        contents: {
          Search: {
            tweets: [],
            query: "く え り ー",
          },
        },
        subcontents: {},
        tab: null,
        style: {fontSize: "12px"},
      });
    });
    it("when query is null", () => {
      expect(reducer(template, home.setupSearch(null))).to.deep.equal({
        contents: {
          Search: {
            tweets: [],
            query: "",
          },
        },
        subcontents: {},
        tab: null,
        style: {fontSize: "12px"},
      });
    });
  });
});
