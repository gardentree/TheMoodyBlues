import {all} from "redux-saga/effects";
import screen from "./screen";
import preference from "./preference";
import window from "./window";

export default function* rootSaga() {
  yield all([...screen, ...preference, ...window]);
}
