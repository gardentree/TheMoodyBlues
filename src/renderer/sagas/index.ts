import {all} from 'redux-saga/effects';
import twitter from './twitter'

export default function* rootSaga() {
  yield all([
    ...twitter,
  ])
}
