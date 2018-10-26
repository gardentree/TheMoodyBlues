import launchPrinciapl from "./principal";
import launchPreferences from "./preferences";

require("photon/dist/css/photon.css");

require("./index.scss");
function requireAll(r: any) {
  r.keys().forEach(r);
}
requireAll((require as any).context("./", true, /\.scss$/));

switch (location.search) {
  case "":
    launchPrinciapl();
    break;
  case "?preferences":
    launchPreferences();
    break;
}
