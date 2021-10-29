import {put, call} from "redux-saga/effects";
import ComponentSaga from "./abstract";
import * as timelines from "@modules/timelines";
import mute from "../../helpers/mute";

const {TheMoodyBlues} = window;

export default class TimelineSaga extends ComponentSaga {
  constructor(agent: TheMoodyBlues.TwitterAgent, timeline: TheMoodyBlues.Store.Timeline) {
    super(agent, timeline);
  }

  *initialize(action: TheMoodyBlues.ReduxAction) {
    const tweets: Twitter.Tweet[] = yield call(TheMoodyBlues.storage.getTweets, this.timeline.preference.identity);

    if (tweets.length > 0) {
      yield put(timelines.updateTweets(tweets, action.payload!.identity));
      yield put(timelines.read(this.timeline.preference.identity, tweets[0].id));
    } else {
      yield put(timelines.updateTweets([], action.payload!.identity));
    }

    yield this.spawnTimer();
    yield this.startTimer();
  }
  *order(action: TheMoodyBlues.ReduxAction) {
    if (action.meta.force) this.timeline.tweets = [];

    const parameters = (this.timeline.preference.parameters || []).concat(this.latest());
    let tweets: Twitter.Tweet[] = yield call(this.agent[this.timeline.preference.way], ...parameters);
    if (tweets.length > 0) {
      if (this.timeline.preference.mute) {
        tweets = mute(tweets);
      }
      if (this.timeline.preference.growl) {
        TheMoodyBlues.growl(tweets);
      }

      const newTweets = tweets.concat(this.timeline.tweets).slice(0, 400);

      yield call(TheMoodyBlues.storage.setTweets, this.timeline.preference.identity, newTweets);
      yield put(timelines.updateTweets(newTweets, this.timeline.preference.identity));
    }
    yield this.restartTimer();
  }
}
