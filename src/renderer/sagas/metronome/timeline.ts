import {put, call} from "redux-saga/effects";
import * as actions from "@actions";
import {guard} from "@libraries/gatekeeper";
import * as timer from "./timer";

const {facade} = window;

export function* initialize(identifier: TMB.ScreenID, preference: TMB.ScreenPreference) {
  const tweets: Twitter.Tweet[] = yield call(facade.storage.getTweets, identifier);

  if (tweets.length > 0) {
    yield put(actions.updateTweets({identifier, tweets}));
    yield put(actions.mark({identifier, lastReadID: tweets[0].id_str}));
  } else {
    yield put(actions.updateTweets({identifier, tweets: []}));
  }

  yield timer.spawn(identifier, preference.interval);
  yield timer.start(identifier);
}
export function* order(identifier: TMB.ScreenID, screen: TMB.Screen, preference: TMB.ScreenPreference, gatekeeper: TMB.GatekeeperPreference, force: boolean) {
  const oldTweets = force ? [] : screen.tweets;

  const parameters = (preference.parameters || []).concat(latest(oldTweets) || []);
  let tweets: Twitter.Tweet[] = yield call(facade.agent[preference.way] as (...parameters: unknown[]) => Promise<Twitter.Tweet[]>, ...parameters);
  if (tweets.length > 0) {
    if (preference.mute) {
      tweets = guard(tweets, gatekeeper);
    }
    if (preference.growl) {
      facade.actions.growl(tweets);
    }

    const newTweets = tweets.concat(oldTweets).slice(0, 400);

    yield call(facade.storage.setTweets, identifier, newTweets);
    yield put(actions.updateTweets({identifier, tweets: newTweets}));
  }
  yield timer.restart(identifier);
}

function latest(tweets: Twitter.Tweet[]): string | null {
  return tweets.length > 0 ? tweets[0].id_str : null;
}
