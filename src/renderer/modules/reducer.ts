import {combineReducers} from "redux";
import {reducer as formReducer} from "redux-form";

import agent from "./agent";
import timelines from "./timelines";
import subcontents from "./subcontents";
import principal from "./principal";

export default combineReducers({
  agent,
  timelines,
  subcontents,
  principal,
  form: formReducer,
});
