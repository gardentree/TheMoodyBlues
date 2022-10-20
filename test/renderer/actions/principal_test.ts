import {expect} from "chai";
import reducer, {setScreens, focusScreen, zoomIn, zoomOut, zoomReset, showLoading} from "@actions/principal";

describe("@renderer/actions/principal", () => {
  describe(setScreens.toString(), () => {
    it("when initialization", () => {
      const state = {
        screens: [],
        focused: "",
        style: {
          fontSize: "12px",
        },
        nowLoading: false,
      };
      expect(reducer(state, setScreens(["first"]))).to.deep.equal({
        screens: ["first"],
        focused: "",
        style: {
          fontSize: "12px",
        },
        nowLoading: false,
      });
    });
  });

  describe(focusScreen.toString(), () => {
    it("as usual", () => {
      const state = {
        screens: ["first", "second"],
        focused: "first",
        style: {
          fontSize: "12px",
        },
        nowLoading: false,
      };
      expect(reducer(state, focusScreen("second"))).to.deep.equal({
        screens: ["first", "second"],
        focused: "second",
        style: {
          fontSize: "12px",
        },
        nowLoading: false,
      });
    });
  });

  describe(zoomIn.toString(), () => {
    it("as usual", () => {
      const state = {
        screens: [],
        focused: "",
        style: {
          fontSize: "12px",
        },
        nowLoading: false,
      };
      expect(reducer(state, zoomIn())).to.deep.equal({
        screens: [],
        focused: "",
        style: {
          fontSize: "13px",
        },
        nowLoading: false,
      });
    });
  });
  describe(zoomOut.toString(), () => {
    it("as usual", () => {
      const state = {
        screens: [],
        focused: "",
        style: {
          fontSize: "12px",
        },
        nowLoading: false,
      };
      expect(reducer(state, zoomOut())).to.deep.equal({
        screens: [],
        focused: "",
        style: {
          fontSize: "11px",
        },
        nowLoading: false,
      });
    });
  });
  describe(zoomReset.toString(), () => {
    it("as usual", () => {
      const state = {
        screens: [],
        focused: "",
        style: {
          fontSize: "20px",
        },
        nowLoading: false,
      };
      expect(reducer(state, zoomReset())).to.deep.equal({
        screens: [],
        focused: "",
        style: {
          fontSize: "12px",
        },
        nowLoading: false,
      });
    });
  });

  describe(showLoading.toString(), () => {
    it("as usual", () => {
      const state = {
        screens: [],
        focused: "",
        style: {
          fontSize: "12px",
        },
        nowLoading: false,
      };
      expect(reducer(state, showLoading(true))).to.deep.equal({
        screens: [],
        focused: "",
        style: {
          fontSize: "12px",
        },
        nowLoading: true,
      });
    });
  });
});
