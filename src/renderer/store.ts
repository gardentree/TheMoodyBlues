import {configureStore} from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import {createLogger} from "redux-logger";
import rootSaga from "./sagas";
import rootReducer from "./actions/reducer";
import {setup as setupEvents} from "./events";
import {environment} from "@shared/tools";

export function createStore() {
  const sagaMiddleware = createSagaMiddleware();
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
      const middlewares = [
        ...getDefaultMiddleware({
          serializableCheck: false,
        }),
        sagaMiddleware,
      ];

      if (environment.isDevelopment()) {
        middlewares.push(createLogger());
      }

      return middlewares;
    },
    devTools: environment.isDevelopment(),
  });

  sagaMiddleware.run(rootSaga);

  setupEvents(store);

  return store;
}
