import {put, call, takeLatest, takeEvery, select, actionChannel, race, fork, take} from "redux-saga/effects";
import growl from "../helpers/growly";
import mute from "../helpers/mute";
import * as storage from "../others/storage";
import Action from "../others/action";
import * as home from "../modules/home";

const logger = require("electron-log");

class ComponentSaga {
  account: any;
  content: any;

  constructor(account: any, content: any) {
    this.account = account;
    this.content = content;
  }

  protected latest(): string {
    return this.content.tweets.length > 0 ? this.content.tweets[0].id_str : null;
  }
}
class TimelineSaga extends ComponentSaga {
  constructor(account: any, content: any) {
    super(account, content);
  }

  *initialize(action: Action) {
    const tweets = yield call(storage.getTweets);

    yield put(home.selectTab("Timeline"));
    if (tweets.length > 0) {
      yield put(home.updateTweets(tweets, action.payload.tab));
      yield put(home.read(tweets[0].id));
    }

    yield fork(runTimer, "Timeline", 120 * 1000);
    yield restartTimer("Timeline");
  }
  *order(action: Action) {
    if (action.meta.force) this.content.tweets = [];

    let tweets = yield call(this.account.timeline, this.latest());
    tweets = mute(tweets);
    growl(tweets);

    const newTweets = tweets.concat(this.content.tweets).slice(0, 400);

    yield call(storage.setTweets, newTweets);

    yield put(home.updateTweets(newTweets, "Timeline"));
    yield restartTimer("Timeline");
  }
}
class SearchSaga extends ComponentSaga {
  constructor(account: any, content: any) {
    super(account, content);
  }

  *initialize(action: Action) {
    yield fork(runTimer, "Search", 60 * 1000);
  }
  *order(action: Action) {
    yield put({type: `${"Search"}_STOP_TIMER`});

    const query = this.content.query || "";
    if (query.length > 0) {
      const tweets = yield call(this.account.search, query, this.latest());
      const newTweets = tweets.concat(this.content.tweets).slice(0, 400);

      yield put(home.updateTweets(newTweets, "Search", {query: query}));
      if (tweets.length > 0 && this.content.tweets.length <= 0) {
        yield put(home.read(tweets[0].id));
      }

      yield put({type: `${"Search"}_START_TIMER`});
    } else {
      yield put(home.updateTweets([], "Search", {query: query}));
    }
  }
}

const getSaga = function(state: any, name: string) {
  const {account, home} = state;

  switch (name) {
    case "Timeline":
      return new TimelineSaga(account, home.contents["Timeline"]);
    case "Search":
      return new SearchSaga(account, home.contents["Search"]);
    default:
      throw new Error(name);
  }
};

function* initialize(action: Action) {
  const {payload} = action;
  const state = yield select();
  const home = state.home;

  if (!home.contents) home.contents = {};
  home.contents[payload.tab] = {};

  yield getSaga(state, payload.tab).initialize(action);
}

function* reorder(action: Action) {
  const {tab} = (yield select()).home;

  yield order(action.meta.tab || tab, action);
}
function* order(tab: string, action: Action) {
  yield getSaga(yield select(), tab).order(action);
}

function* restartTimer(name: string) {
  yield put({type: `${name}_STOP_TIMER`});
  yield put({type: `${name}_START_TIMER`});
}

function* searchTweets(action: Action) {
  const {payload} = action;

  yield put(home.selectTab("Search"));
  yield put(home.updateTweets([], "Search", {query: payload.query}));
  yield put(home.reload(true, "Search"));
}

function* runTimer(tab: string, interval: number) {
  const channel = yield actionChannel(`${tab}_START_TIMER`);

  const wait = (ms: number) =>
    new Promise((resolve) => {
      setTimeout(() => resolve(), ms);
    });
  while (yield take(channel)) {
    while (true) {
      const winner = yield race({
        stopped: take(`${tab}_STOP_TIMER`),
        tick: call(wait, interval),
      });

      if (winner.stopped) {
        break;
      }

      yield put(home.reload(false, tab));
      console.log(`reload ${tab}: ${new Date()}`);
    }
  }
}

function* displayUserTimeline(action: Action) {
  const {account} = yield select();

  let tweets = yield call(account.userTimeline, action.payload.name);
  yield put(home.updateTweetsInSubContents(tweets));
}

const wrap = (saga: any) =>
  function*(action: Action) {
    logger.info(action);
    try {
      yield call(saga, action);
    } catch (error) {
      logger.error(error);
      yield put(home.alarm(error));
    }
  };

// prettier-ignore
export default [
  takeLatest(home.reload, wrap(reorder)),
  takeLatest(home.searchTweets, wrap(searchTweets)),
  takeLatest(home.displayUserTimeline, wrap(displayUserTimeline)),
  takeEvery(home.mountComponent, wrap(initialize))
];
