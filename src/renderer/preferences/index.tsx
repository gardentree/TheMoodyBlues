import * as React from "react";
import * as ReactDOM from "react-dom";
import Preferences from "./components/Preferences";
import {library} from "@fortawesome/fontawesome-svg-core";
import {fab} from "@fortawesome/free-brands-svg-icons";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";

require("photon/dist/css/photon.css");

require("../index.scss");
function requireAll(r: any) {
  r.keys().forEach(r);
}
requireAll((require as any).context("./", true, /\.scss$/));

library.add(fab, faSpinner);

ReactDOM.render(<Preferences />, document.getElementById("app"));
