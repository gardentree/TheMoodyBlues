import * as React from "react";
import * as ReactDOM from "react-dom";
import {createStore, applyMiddleware} from "redux";
import createSagaMiddleware from "redux-saga";
import rootReducer from "./modules/reducer";
import rootSaga from "./sagas";
import {Provider} from "react-redux";
import Principal from "./components/Principal";
import {createLogger} from "redux-logger";
import {makeInitialTimeline, initialPreferences} from "@libraries/timeline";
import keybinds from "./keybinds";

const {facade} = window;

export default async function launch() {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(rootReducer, applyMiddleware(sagaMiddleware, createLogger()));

  sagaMiddleware.run(rootSaga);

  keybinds(store);
  store.getState()["timelines"] = await loadTimelines();

  ReactDOM.render(
    <Provider store={store}>
      <Principal />
    </Provider>,
    document.getElementById("app")
  );
}

async function loadTimelines() {
  const timelines: TimelineMap = new Map();

  for (const preference of (await facade.storage.getTimelinePreferences()) || initialPreferences()) {
    if (!preference.active) {
      continue;
    }

    timelines.set(preference.identity, await makeInitialTimeline(preference));
  }

  return timelines;
}
