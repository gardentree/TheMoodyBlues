import {put, call} from "redux-saga/effects";
import * as timelines from "@modules/timelines";
import {silence} from "@libraries/silencer";
import * as timer from "./timer";

const {TheMoodyBlues} = window;

export function* initialize(timeline: TheMoodyBlues.Store.Timeline) {
  const identity = timeline.preference.identity;
  yield timer.spawn(identity, timeline.preference.interval);
}
export function* order(timeline: TheMoodyBlues.Store.Timeline, agent: TheMoodyBlues.TwitterAgent, force: boolean) {
  const identity = timeline.preference.identity;

  yield timer.stop(identity);

  const oldTweets = timeline.tweets;
  const query = timeline.state.query || "";
  if (query.length > 0) {
    let tweets: Twitter.Tweet[] = yield call(agent.search, query, latest(oldTweets));
    if (timeline.preference.mute) {
      tweets = silence(tweets, timeline.mute);
    }
    if (timeline.preference.growl) {
      TheMoodyBlues.growl(tweets);
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
