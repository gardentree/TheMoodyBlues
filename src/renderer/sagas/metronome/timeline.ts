import {put, call} from "redux-saga/effects";
import * as actions from "@actions";
import {silence} from "@libraries/silencer";
import * as timer from "./timer";

const {facade} = window;

export function* initialize(identity: TMB.ScreenID, preference: TMB.ScreenPreference) {
  const tweets: Twitter.Tweet[] = yield call(facade.storage.getTweets, identity);

  if (tweets.length > 0) {
    yield put(actions.updateTweets(identity, tweets));
    yield put(actions.mark(identity, tweets[0].id_str));
  } else {
    yield put(actions.updateTweets(identity, []));
  }

  yield timer.spawn(identity, preference.interval);
  yield timer.start(identity);
}
export function* order(identity: TMB.ScreenID, screen: TMB.Screen, preference: TMB.Preference, force: boolean) {
  const oldTweets = force ? [] : screen.tweets;

  const parameters = (preference.screen.parameters || []).concat(latest(oldTweets) || []);
  let tweets: Twitter.Tweet[] = yield call(facade.agent[preference.screen.way] as (...parameters: unknown[]) => Promise<Twitter.Tweet[]>, ...parameters);
  if (tweets.length > 0) {
    if (preference.screen.mute) {
      tweets = silence(tweets, preference.mute);
    }
    if (preference.screen.growl) {
      facade.actions.growl(tweets);
    }

    const newTweets = tweets.concat(oldTweets).slice(0, 400);

    yield call(facade.storage.setTweets, identity, newTweets);
    yield put(actions.updateTweets(identity,newTweets));
  }
  yield timer.restart(identity);
}

function latest(tweets: Twitter.Tweet[]): string | null {
  return tweets.length > 0 ? tweets[0].id_str : null;
}
