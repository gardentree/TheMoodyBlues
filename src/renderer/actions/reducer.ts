import {combineReducers} from "redux";
import {reducer as formReducer} from "redux-form";

import screens from "./screens";
import preferences from "./preferences";
import gatekeeper from "./gatekeeper";
import principal from "./principal";
import lineage from "./lineage";

export default combineReducers({
  screens,
  preferences,
  gatekeeper,
  principal,
  lineage,
  form: formReducer,
});
