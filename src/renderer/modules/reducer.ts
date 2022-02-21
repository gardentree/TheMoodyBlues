import {combineReducers} from "redux";
import {reducer as formReducer} from "redux-form";

import timelines from "./timelines";
import preferences from "./preferences";
import subcontents from "./subcontents";
import principal from "./principal";

export default combineReducers({
  timelines,
  preferences,
  subcontents,
  principal,
  form: formReducer,
});
