import * as React from "react";
import * as ReactDOM from "react-dom";
import Preferences from "./components/Preferences";

export default function launch() {
  ReactDOM.render(<Preferences />, document.getElementById("app"));
}
