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
        dialog: null,
      };
      expect(reducer(state, setScreens(["first"]))).toEqual({
        screens: ["first"],
        focused: "",
        style: {
          fontSize: "12px",
        },
        nowLoading: false,
        dialog: null,
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
        dialog: null,
      };
      expect(reducer(state, focusScreen("second"))).toEqual({
        screens: ["first", "second"],
        focused: "second",
        style: {
          fontSize: "12px",
        },
        nowLoading: false,
        dialog: null,
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
        dialog: null,
      };
      expect(reducer(state, zoomIn())).toEqual({
        screens: [],
        focused: "",
        style: {
          fontSize: "13px",
        },
        nowLoading: false,
        dialog: null,
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
        dialog: null,
      };
      expect(reducer(state, zoomOut())).toEqual({
        screens: [],
        focused: "",
        style: {
          fontSize: "11px",
        },
        nowLoading: false,
        dialog: null,
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
        dialog: null,
      };
      expect(reducer(state, zoomReset())).toEqual({
        screens: [],
        focused: "",
        style: {
          fontSize: "12px",
        },
        nowLoading: false,
        dialog: null,
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
        dialog: null,
      };
      expect(reducer(state, showLoading(true))).toEqual({
        screens: [],
        focused: "",
        style: {
          fontSize: "12px",
        },
        nowLoading: true,
        dialog: null,
      });
    });
  });
});
