import launchPrinciapl from "./principal";
import launchPreferences from "./preferences";

switch (location.search) {
  case "":
    launchPrinciapl();
    break;
  case "?preferences":
    launchPreferences();
    break;
}
