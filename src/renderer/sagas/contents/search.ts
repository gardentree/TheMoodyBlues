import {put, call} from "redux-saga/effects";
import ComponentSaga from "./abstract";
import * as timelines from "@modules/timelines";
import mute from "../../helpers/mute";

const {TheMoodyBlues} = window;

export default class SearchSaga extends ComponentSaga {
  constructor(agent: TheMoodyBlues.TwitterAgent, timeline: TheMoodyBlues.Store.Timeline) {
    super(agent, timeline);
  }

  *initialize(action: TheMoodyBlues.ReduxAction) {
    yield this.spawnTimer();
  }
  *order(action: TheMoodyBlues.ReduxAction) {
    yield this.stopTimer();

    const query = this.timeline.state.query || "";
    if (query.length > 0) {
      let tweets: Twitter.Tweet[] = yield call(this.agent.search, query, this.latest());
      if (this.timeline.preference.mute) {
        tweets = mute(tweets);
      }
      if (this.timeline.preference.growl) {
        TheMoodyBlues.growl(tweets);
      }

      const newTweets = tweets.concat(this.timeline.tweets).slice(0, 400);

      yield put(timelines.updateTweets(newTweets, this.timeline.preference.identity, {query: query}));
      if (tweets.length > 0 && this.timeline.tweets.length <= 0) {
        yield put(timelines.read(this.timeline.preference.identity, tweets[0].id));
      }

      yield this.startTimer();
    } else {
      yield put(timelines.setupSearch(this.timeline.preference.identity, ""));
    }
  }
}
