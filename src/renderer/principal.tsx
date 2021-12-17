import * as React from "react";
import * as ReactDOM from "react-dom";
import {createStore, applyMiddleware} from "redux";
import createSagaMiddleware from "redux-saga";
import rootReducer from "./modules/reducer";
import rootSaga from "./sagas";
import {Provider} from "react-redux";
import Principal from "./components/Principal";
import VerifierForm from "./components/VerifierForm";
import {createLogger} from "redux-logger";
import {initialPreferences} from "@libraries/timeline";

const {TheMoodyBlues} = window;

export default function launch() {
  (async () => {
    const agent = await new Promise<TheMoodyBlues.TwitterAgent>((resolve, reject) => {
      resolve(TheMoodyBlues.agent.authorize(showVerifierForm));
    });

    setup(agent);
  })();
}

function setup(agent: TheMoodyBlues.TwitterAgent) {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(rootReducer, applyMiddleware(sagaMiddleware, createLogger()));

  sagaMiddleware.run(rootSaga);

  TheMoodyBlues.keybinds(store);
  store.getState()["agent"] = agent;
  store.getState()["timelines"] = loadTimelines();

  ReactDOM.render(
    <Provider store={store}>
      <Principal />
    </Provider>,
    document.getElementById("app")
  );
}

function showVerifierForm() {
  return new Promise<string>((resolve, reject) => {
    const callback = (verifier: string) => {
      resolve(verifier);
    };
    ReactDOM.render(<VerifierForm callback={callback} />, document.getElementById("app"));
  });
}

function loadTimelines() {
  const timelines: TheMoodyBlues.Store.TimelineMap = new Map();

  for (const preference of TheMoodyBlues.storage.getTimelinePreferences()||initialPreferences()) {
    if (!preference.active) {
      continue;
    }

    timelines.set(preference.identity, {
      preference: preference,
      tweets: [],
      state: {
        lastReadID: "",
      },
    });
  }

  return timelines;
}
