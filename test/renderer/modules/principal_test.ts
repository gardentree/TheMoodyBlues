import {expect} from "chai";
import * as principal from "@modules/principal";
import {default as reducer} from "@modules/principal";

const template = {
  focused: "",
  style: {
    fontSize: "12px",
  },
  nowLoading: false,
};

describe(reducer.name, () => {
  it("selectTab", () => {
    expect(reducer(template, principal.selectTab("home"))).to.deep.equal({
      focused: "home",
      style: {
        fontSize: "12px",
      },
      nowLoading: false,
    });
  });

  it("zoomIn", () => {
    expect(reducer({...template, style: {fontSize: "10px"}}, principal.zoomIn())).to.deep.equal({
      style: {
        fontSize: "11px",
      },
      focused: "",
      nowLoading: false,
    });
  });
  it("zoomOut", () => {
    expect(reducer({...template, style: {fontSize: "10px"}}, principal.zoomOut())).to.deep.equal({
      style: {
        fontSize: "9px",
      },
      focused: "",
      nowLoading: false,
    });
  });
  it("zoomReset", () => {
    expect(reducer({...template, style: {fontSize: "10px"}}, principal.zoomReset())).to.deep.equal({
      style: {
        fontSize: "12px",
      },
      focused: "",
      nowLoading: false,
    });
  });
});
