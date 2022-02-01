import launchPrinciapl from "./principal";
import {library} from "@fortawesome/fontawesome-svg-core";
import {fab} from "@fortawesome/free-brands-svg-icons";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import * as React from "react";
import * as ReactDOM from "react-dom";
import VerifierForm from "./components/VerifierForm";
import {Actions as FacadeActions} from "@shared/facade";

require("photon/dist/css/photon.css");

require("./index.scss");
function requireAll(r: any) {
  r.keys().forEach(r);
}
requireAll((require as any).context("./", true, /\.scss$/));

library.add(fab, faSpinner);

const {facade} = window;
facade.ipc.observe("showVerifierForm", (event: Event, ...values: any[]) => {
  const callback = (verifier: string) => {
    facade.ipc.action("authorize");
  };
  ReactDOM.render(<VerifierForm callback={callback} />, document.getElementById("app"));
});
facade.ipc.observe("launch", (event: Event, ...values: any[]) => {
  launchPrinciapl();
});
facade.ipc.observe(FacadeActions.ALERT, (event: Event, values) => {
  const {error} = values;

  if (error.message) {
    window.alert(error.message);
  } else {
    window.alert(JSON.stringify(error));
  }
});

ReactDOM.render(<div>loading</div>, document.getElementById("app"));
