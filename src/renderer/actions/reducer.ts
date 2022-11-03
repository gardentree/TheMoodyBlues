import {combineReducers} from "redux";

import screens from "./screens";
import backstages from "./backstages";
import gatekeeper from "./gatekeeper";
import principal from "./principal";
import lineage from "./lineage";

export default combineReducers({
  screens,
  backstages,
  gatekeeper,
  principal,
  lineage,
});
