import {combineReducers} from "redux";
import {reducer as formReducer} from "redux-form";

import account from "./account";
import home from "./home";

export default combineReducers({
  account,
  home,
  form: formReducer,
});
