import {expectSaga} from "redux-saga-test-plan";
import {wrap} from "@source/renderer/sagas/library";

describe(wrap.name, () => {
  it("hide loading spinner when alarm", () => {
    const error = new Error();
    function* fail() {
      throw error;

      yield;
    }

    return expectSaga(wrap(fail), {type: "", payload: undefined as never, meta: undefined})
      .put({
        type: "principal/showLoading",
        payload: true,
      })
      .put({
        type: "alarm",
        payload: {message: error},
      })
      .put({
        type: "principal/showLoading",
        payload: false,
      })
      .run();
  });
});
