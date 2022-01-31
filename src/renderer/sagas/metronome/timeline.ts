import {put, call} from "redux-saga/effects";
import * as timelines from "@modules/timelines";
import {silence} from "@libraries/silencer";
import * as timer from "./timer";

const {facade} = window;

export function* initialize(timeline: TheMoodyBlues.Store.Timeline) {
  const identity = timeline.preference.identity;
  const tweets: Twitter.Tweet[] = yield call(facade.storage.getTweets, identity);

  if (tweets.length > 0) {
    yield put(timelines.updateTweets(tweets, identity));
    yield put(timelines.read(identity, tweets[0].id));
  } else {
    yield put(timelines.updateTweets([], identity));
  }

  yield timer.spawn(identity, timeline.preference.interval);
  yield timer.start(identity);
}
export function* order(timeline: TheMoodyBlues.Store.Timeline,force: boolean) {
  const identity = timeline.preference.identity;

  const oldTweets = force ? [] : timeline.tweets;

  const parameters = (timeline.preference.parameters || []).concat(latest(oldTweets));
  let tweets: Twitter.Tweet[] = yield call(facade.agent[timeline.preference.way] as any, ...parameters);
  if (tweets.length > 0) {
    if (timeline.preference.mute) {
      tweets = silence(tweets, timeline.mute);
    }
    if (timeline.preference.growl) {
      facade.growl(tweets);
    }

    const newTweets = tweets.concat(oldTweets).slice(0, 400);

    yield call(facade.storage.setTweets, identity, newTweets);
    yield put(timelines.updateTweets(newTweets, identity));
  }
  yield timer.restart(identity);
}

function latest(tweets: Twitter.Tweet[]): string | null {
  return tweets.length > 0 ? tweets[0].id_str : null;
}
