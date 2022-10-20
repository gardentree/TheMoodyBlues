import {takeLatest, takeEvery} from "redux-saga/effects";
import * as actions from "@actions";
import * as stories from "./screen/stories";
import {wrap} from "./library";

// prettier-ignore
export default [
  takeLatest(actions.searchTweets.type, wrap(stories.searchTweets)),
  takeLatest(actions.displayUserTimeline.type, wrap(stories.displayUserTimeline)),
  takeLatest(actions.displayConversation.type, wrap(stories.displayConversation)),
  takeEvery(actions.mountScreen.type, wrap(stories.launch)),
  takeEvery(actions.unmountScreen.type, wrap(stories.shutdown)),
  takeEvery(actions.reload.type, wrap(stories.reorder)),
  takeEvery(actions.reloadFocusedScreen.type, wrap(stories.reorderFocusedScreen)),
];
