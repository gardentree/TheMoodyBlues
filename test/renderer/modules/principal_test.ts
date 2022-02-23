import {expect} from "chai";
import * as actions from "@actions";
import {default as reducer} from "@reducers/principal";

const template = {
  focused: "",
  style: {
    fontSize: "12px",
  },
  nowLoading: false,
};

describe(reducer.name, () => {
  it("focusScreen", () => {
    expect(reducer(template, actions.focusScreen("home"))).to.deep.equal({
      focused: "home",
      style: {
        fontSize: "12px",
      },
      nowLoading: false,
    });
  });

  it("zoomIn", () => {
    expect(reducer({...template, style: {fontSize: "10px"}}, actions.zoomIn())).to.deep.equal({
      style: {
        fontSize: "11px",
      },
      focused: "",
      nowLoading: false,
    });
  });
  it("zoomOut", () => {
    expect(reducer({...template, style: {fontSize: "10px"}}, actions.zoomOut())).to.deep.equal({
      style: {
        fontSize: "9px",
      },
      focused: "",
      nowLoading: false,
    });
  });
  it("zoomReset", () => {
    expect(reducer({...template, style: {fontSize: "10px"}}, actions.zoomReset())).to.deep.equal({
      style: {
        fontSize: "12px",
      },
      focused: "",
      nowLoading: false,
    });
  });
});
