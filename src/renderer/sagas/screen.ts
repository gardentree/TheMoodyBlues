import {takeLatest, takeEvery} from "redux-saga/effects";
import * as actions from "@actions";
import * as stories from "./screen/stories";
import {wrap} from "./library";

// prettier-ignore
export default [
  takeLatest(actions.searchTweets, wrap(stories.searchTweets)),
  takeLatest(actions.displayUserTimeline, wrap(stories.displayUserTimeline)),
  takeLatest(actions.displayConversation, wrap(stories.displayConversation)),
  takeEvery(actions.mountScreen, wrap(stories.launch)),
  takeEvery(actions.unmountScreen, wrap(stories.shutdown)),
  takeEvery(actions.reload, wrap(stories.reorder)),
  takeEvery(actions.reloadFocusedScreen, wrap(stories.reorderFocusedScreen)),
];
