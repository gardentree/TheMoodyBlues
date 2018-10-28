import launchPrinciapl from "./principal";
import launchPreferences from "./preferences";
import {library} from "@fortawesome/fontawesome-svg-core";
import {fab} from "@fortawesome/free-brands-svg-icons";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";

require("photon/dist/css/photon.css");

require("./index.scss");
function requireAll(r: any) {
  r.keys().forEach(r);
}
requireAll((require as any).context("./", true, /\.scss$/));

library.add(fab, faSpinner);

switch (location.search) {
  case "":
    launchPrinciapl();
    break;
  case "?preferences":
    launchPreferences();
    break;
}
