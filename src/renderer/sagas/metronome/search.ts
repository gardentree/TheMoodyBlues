import {put, call} from "redux-saga/effects";
import * as actions from "@actions";
import {silence} from "@libraries/silencer";
import * as timer from "./timer";

const {facade} = window;

export function* initialize(identifier: TMB.ScreenID, preference: TMB.ScreenPreference) {
  yield timer.spawn(identifier, preference.interval);
}
export function* order(identifier: TMB.ScreenID, screen: TMB.Screen, preference: TMB.ScreenPreference, gatekeeper: TMB.GatekeeperPreference, force: boolean) {
  yield timer.stop(identifier);

  const oldTweets = screen.tweets;
  const query = screen.options?.query || "";
  if (query.length > 0) {
    let tweets: Twitter.Tweet[] = yield call(facade.agent.search, query, latest(oldTweets));
    if (preference.mute) {
      tweets = silence(tweets, gatekeeper);
    }
    if (preference.growl) {
      facade.actions.growl(tweets);
    }

    const newTweets = tweets.concat(oldTweets).slice(0, 400);

    yield put(actions.updateTweets({identifier, tweets: newTweets, options: {query: query}}));
    if (tweets.length > 0 && oldTweets.length <= 0) {
      yield put(actions.mark({identifier, lastReadID: tweets[0].id_str}));
    }

    yield timer.start(identifier);
  } else {
    yield put(actions.setupSearch({identifier, query: ""}));
  }
}

function latest(tweets: Twitter.Tweet[]): string | null {
  return tweets.length > 0 ? tweets[0].id_str : null;
}
