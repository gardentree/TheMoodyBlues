import * as React from "react";
import * as ReactDOM from "react-dom";
import {createStore, applyMiddleware} from "redux";
import createSagaMiddleware from "redux-saga";
import rootReducer from "./modules/reducer";
import rootSaga from "./sagas";
import {Provider} from "react-redux";
import Principal from "./components/Principal";
import keybinds from "./helpers/keybinds";
import authorize from "./helpers/authentication";

import "photon/dist/css/photon.css";
import "./index.scss";

const main = (twitter: any) => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

  sagaMiddleware.run(rootSaga);

  keybinds(store);
  store.getState()["account"] = twitter;

  ReactDOM.render(
    <Provider store={store}>
      <Principal />
    </Provider>,
    document.getElementById("app")
  );
};

(async () => {
  const client = await new Promise((resolve, reject) => {
    resolve(authorize());
  });

  main(client);
})();
