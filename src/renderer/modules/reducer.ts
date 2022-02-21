import {combineReducers} from "redux";
import {reducer as formReducer} from "redux-form";

import screens from "./screens";
import preferences from "./preferences";
import subcontents from "./subcontents";
import principal from "./principal";

export default combineReducers({
  screens,
  preferences,
  subcontents,
  principal,
  form: formReducer,
});
