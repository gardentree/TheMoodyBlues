import {put, call} from "redux-saga/effects";
import * as actions from "@actions";
import {silence} from "@libraries/silencer";
import * as timer from "./timer";

const {facade} = window;

export function* initialize(identity: TMB.ScreenID, preference: TMB.ScreenPreference) {
  yield timer.spawn(identity, preference.interval);
}
export function* order(identity: TMB.ScreenID, screen: TMB.Screen, preference: TMB.Preference, force: boolean) {
  yield timer.stop(identity);

  const oldTweets = screen.tweets;
  const query = screen.options?.query || "";
  if (query.length > 0) {
    let tweets: Twitter.Tweet[] = yield call(facade.agent.search, query, latest(oldTweets));
    if (preference.screen.mute) {
      tweets = silence(tweets, preference.mute);
    }
    if (preference.screen.growl) {
      facade.actions.growl(tweets);
    }

    const newTweets = tweets.concat(oldTweets).slice(0, 400);

    yield put(actions.updateTweets(newTweets, identity, {query: query}));
    if (tweets.length > 0 && oldTweets.length <= 0) {
      yield put(actions.mark(identity, tweets[0].id_str));
    }

    yield timer.start(identity);
  } else {
    yield put(actions.setupSearch(identity, ""));
  }
}

function latest(tweets: Twitter.Tweet[]): string | null {
  return tweets.length > 0 ? tweets[0].id_str : null;
}
