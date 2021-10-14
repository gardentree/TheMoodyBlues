import {combineReducers} from "redux";
import {reducer as formReducer} from "redux-form";

import agent from "./agent";
import home from "./home";

export default combineReducers({
  agent,
  home,
  form: formReducer,
});
