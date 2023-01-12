import {createRoot} from "react-dom/client";
import {Provider} from "react-redux";
import VerifierForm from "./components/VerifierForm";
import Principal from "./components/Principal";
import {CacheProvider} from "@emotion/react";
import {createStyleCache} from "./styles";
import {createStore} from "./store";
import * as actions from "@actions";

const styleCache = createStyleCache();

const {facade} = window;
facade.events.onShowVerifierForm(() => {
  const callback = (verifier: string) => {
    facade.actions.authorize(verifier);
  };
  createRoot(document.getElementById("container")!).render(
    <CacheProvider value={styleCache}>
      <VerifierForm callback={callback} />
    </CacheProvider>
  );
});
facade.events.onLaunch(() => {
  const store = createStore();

  store.dispatch(actions.prepareState());

  createRoot(document.getElementById("container")!).render(
    <CacheProvider value={styleCache}>
      <Provider store={store}>
        <Principal />
        <div id="modals" />
      </Provider>
    </CacheProvider>
  );
});
facade.events.onAlert((error: unknown) => {
  if (error instanceof Error) {
    window.alert(error.message);
  } else {
    window.alert(JSON.stringify(error));
  }
});
