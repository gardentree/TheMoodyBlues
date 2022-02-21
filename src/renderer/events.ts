import {MiddlewareAPI} from "redux";
import * as actions from "@actions";

const {facade} = window;

export function setup(store: MiddlewareAPI) {
  facade.events.onChangeMode((identity, mode) => {
    store.dispatch(actions.changeMode(identity, mode));
  });
}
