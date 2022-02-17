import {MiddlewareAPI} from "redux";
import {changeMode} from "@modules/timelines";

const {facade} = window;

export function setup(store: MiddlewareAPI) {
  facade.events.onChangeMode((identity, mode) => {
    store.dispatch(changeMode(identity, mode));
  });
}
