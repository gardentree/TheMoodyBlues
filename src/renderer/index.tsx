import launchPrinciapl from "./principal";
import {library} from "@fortawesome/fontawesome-svg-core";
import {fab} from "@fortawesome/free-brands-svg-icons";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import * as React from "react";
import * as ReactDOM from "react-dom";
import VerifierForm from "./components/VerifierForm";

(() => {
  require("photon/dist/css/photon.css");

  function requireAll(context: __WebpackModuleApi.RequireContext) {
    context.keys().forEach(context);
  }
  requireAll(require.context("./", true, /\.scss$/));

  library.add(fab, faSpinner);
})();

const {facade} = window;
facade.events.onShowVerifierForm(() => {
  const callback = (verifier: string) => {
    facade.actions.authorize(verifier);
  };
  ReactDOM.render(<VerifierForm callback={callback} />, document.getElementById("app"));
});
facade.events.onLaunch(() => {
  launchPrinciapl();
});
facade.events.onAlert((error: unknown) => {
  if (error instanceof Error) {
    window.alert(error.message);
  } else {
    window.alert(JSON.stringify(error));
  }
});

ReactDOM.render(<div>loading</div>, document.getElementById("app"));
