import * as React from "react";
import {createRoot} from "react-dom/client";
import {configureStore} from "@reduxjs/toolkit";
import {Provider} from "react-redux";
import createSagaMiddleware from "redux-saga";
import {createLogger} from "redux-logger";
import {library, config} from "@fortawesome/fontawesome-svg-core";
import {fab} from "@fortawesome/free-brands-svg-icons";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import rootSaga from "./sagas";
import rootReducer from "./actions/reducer";
import * as actions from "@actions";
import {setup as setupEvents} from "./events";
import VerifierForm from "./components/VerifierForm";
import Principal from "./components/Principal";

(() => {
  require("photon/dist/css/photon.css");
  require("@fortawesome/fontawesome-svg-core/styles.css");

  function requireAll(context: __WebpackModuleApi.RequireContext) {
    context.keys().forEach(context);
  }
  requireAll(require.context("./", true, /\.scss$/));

  config.autoAddCss = false;
  library.add(fab, faSpinner);
})();

const {facade} = window;
facade.events.onShowVerifierForm(() => {
  const callback = (verifier: string) => {
    facade.actions.authorize(verifier);
  };
  createRoot(document.getElementById("container")!).render(<VerifierForm callback={callback} />);
});
facade.events.onLaunch(() => {
  const sagaMiddleware = createSagaMiddleware();
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => [
      ...getDefaultMiddleware({
        serializableCheck: false,
      }),
      sagaMiddleware,
      createLogger(),
    ],
    devTools: true,
  });

  sagaMiddleware.run(rootSaga);

  setupEvents(store);
  store.dispatch(actions.prepareState());

  createRoot(document.getElementById("container")!).render(
    <Provider store={store}>
      <Principal />
      <div id="modals" />
    </Provider>
  );
});
facade.events.onAlert((error: unknown) => {
  if (error instanceof Error) {
    window.alert(error.message);
  } else {
    window.alert(JSON.stringify(error));
  }
});
