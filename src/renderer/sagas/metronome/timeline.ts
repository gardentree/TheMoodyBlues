import {put, call} from "redux-saga/effects";
import * as timelines from "@modules/timelines";
import {silence} from "@libraries/silencer";
import * as timer from "./timer";

const {facade} = window;

export function* initialize(identity: TheMoodyBlues.TimelineIdentity, preference: TheMoodyBlues.TimelinePreference) {
  const tweets: Twitter.Tweet[] = yield call(facade.storage.getTweets, identity);

  if (tweets.length > 0) {
    yield put(timelines.updateTweets(tweets, identity));
    yield put(timelines.read(identity, tweets[0].id));
  } else {
    yield put(timelines.updateTweets([], identity));
  }

  yield timer.spawn(identity, preference.interval);
  yield timer.start(identity);
}
export function* order(identity: TheMoodyBlues.TimelineIdentity, timeline: TheMoodyBlues.Timeline, preference: TheMoodyBlues.Preference, force: boolean) {
  const oldTweets = force ? [] : timeline.tweets;

  const parameters = (preference.timeline.parameters || []).concat(latest(oldTweets));
  let tweets: Twitter.Tweet[] = yield call(facade.agent[preference.timeline.way] as (...parameters: unknown[]) => Promise<Twitter.Tweet[]>, ...parameters);
  if (tweets.length > 0) {
    if (preference.timeline.mute) {
      tweets = silence(tweets, preference.mute);
    }
    if (preference.timeline.growl) {
      facade.actions.growl(tweets);
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
