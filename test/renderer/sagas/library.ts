import {expectSaga} from "redux-saga-test-plan";
import {expect} from "chai";
import {wrap} from "@source/src/renderer/library";

describe(wrap.name, () => {
  it("hide loading spinner when alarm", () => {
    function* fail() {
      throw new Error();
    }

    return expectSaga(wrap(fail), {})
      .put({
        type: "SHOW_LOADING",
        payload: {nowLoading: true},
      })
      .put({
        type: "ALARM",
        error: true,
        payload: new Error(),
      })
      .put({
        type: "SHOW_LOADING",
        payload: {nowLoading: false},
      })
      .run();
  });
});
