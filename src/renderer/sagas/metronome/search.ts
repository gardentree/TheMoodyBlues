import {put, call} from "redux-saga/effects";
import * as timelines from "@modules/timelines";
import {silence} from "@libraries/silencer";
import * as timer from "./timer";

const {facade} = window;

export function* initialize(identity: TMB.TimelineIdentity, preference: TMB.TimelinePreference) {
  yield timer.spawn(identity, preference.interval);
}
export function* order(identity: TMB.TimelineIdentity, timeline: TMB.Timeline, preference: TMB.Preference, force: boolean) {
  yield timer.stop(identity);

  const oldTweets = timeline.tweets;
  const query = timeline.state.query || "";
  if (query.length > 0) {
    let tweets: Twitter.Tweet[] = yield call(facade.agent.search, query, latest(oldTweets));
    if (preference.timeline.mute) {
      tweets = silence(tweets, preference.mute);
    }
    if (preference.timeline.growl) {
      facade.actions.growl(tweets);
    }

    const newTweets = tweets.concat(oldTweets).slice(0, 400);

    yield put(timelines.updateTweets(newTweets, identity, {query: query}));
    if (tweets.length > 0 && oldTweets.length <= 0) {
      yield put(timelines.read(identity, tweets[0].id));
    }

    yield timer.start(identity);
  } else {
    yield put(timelines.setupSearch(identity, ""));
  }
}

function latest(tweets: Twitter.Tweet[]): string | null {
  return tweets.length > 0 ? tweets[0].id_str : null;
}
