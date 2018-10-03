import {all} from "redux-saga/effects";
import twitter from "./twitter";
import element from "./element";

export default function* rootSaga() {
  yield all([...twitter]);
  yield all([...element]);
}
