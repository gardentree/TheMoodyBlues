import {put,call,takeLatest,takeEvery,select,actionChannel,race,fork,take} from 'redux-saga/effects';
import * as actions from '../actions';
import Timeline from "../components/Timeline";
import Search from "../components/Search";
import growl from '../helpers/growly';
import mute from '../helpers/mute';
import * as storage from '../others/storage';
import Action from '../others/action';

import * as contents from '../modules/contents';
import * as screen from '../modules/screen';

class ComponentSaga {
  account: any;
  content: any;

  constructor(account: any,content: any) {
    this.account = account;
    this.content = content;
  }

  protected latest(): string {
    return (this.content.tweets.length > 0) ? this.content.tweets[0].id_str:null;
  }
}
class TimelineSaga extends ComponentSaga {
  constructor(account: any,content: any) {
    super(account,content);
  }

  *initialize(action: Action) {
    const tweets = yield call(storage.getTweets);

    yield put(screen.select(Timeline.name));
    yield put(contents.update(tweets,action.payload.screen));

    yield fork(runTimer,Timeline.name,120 * 1000);
    yield restartTimer(Timeline.name);
  }
  *order(action: Action) {
    if (action.meta.force) this.content.tweets = [];

    let tweets = yield call(this.account.timeline,this.latest());
    tweets = mute(tweets);
    growl(tweets);

    const newTweets = tweets.concat(this.content.tweets).slice(0,400);

    yield call(storage.setTweets,newTweets);

    yield put(contents.update(newTweets,Timeline.name));
    yield restartTimer(Timeline.name)
  }
}
class SearchSaga extends ComponentSaga {
  constructor(account: any,content: any) {
    super(account,content);
  }

  *initialize(action: Action) {
    yield fork(runTimer,Search.name,60 * 1000);
  }
  *order(action: Action) {
    const query = this.content.query;
    const tweets = yield call(this.account.search,query,this.latest());
    const newTweets = tweets.concat(this.content.tweets).slice(0,400);

    yield put(contents.update(newTweets,Search.name,{query: query}));
  }
}

const getSaga = function(state: any,name: string) {
  const {account,contents} = state;

  switch (name) {
    case Timeline.name:
      return new TimelineSaga(account,contents[Timeline.name]);
    case Search.name:
      return new SearchSaga(account,contents[Search.name]);
    default:
      throw new Error(name);
  }
}

function* initialize(action: Action) {
  const {payload} = action
  const state = yield select()

  if (!state.contents) state.contents = {};
  state.contents[payload.screen] = {}

  yield getSaga(state,payload.screen).initialize(action);
}

function* reorder(action: Action) {
  const {screen} = yield select();

  yield order(action.meta.screen||screen.name,action)
}
function* order(screenName: string,action: Action) {
  yield getSaga(yield select(),screenName).order(action);
}

function* restartTimer(name: string) {
  yield put({type: `${name}_STOP_TIMER`});
  yield put({type: `${name}_START_TIMER`});
}

function* searchTweets(action: Action) {
  const {payload} = action;

  yield put(screen.select(Search.name));
  yield put(contents.update([],Search.name,{query: payload.query}));
  yield put(contents.reload(true,Search.name));

  yield restartTimer(Search.name)
}

function* runTimer(screen: string,interval: number) {
  const channel = yield actionChannel(`${screen}_START_TIMER`)

  const wait = (ms: number) => (new Promise(resolve => {setTimeout(() => resolve(), ms)}))
  while(yield take(channel)) {
    while(true) {
      const winner = yield race({
        stopped: take(`${screen}_STOP_TIMER`),
        tick: call(wait,interval)
      })

      if (winner.stopped) {
        break;
      }

      yield put(contents.reload(false,screen));
      console.log(`reload ${screen}: ${new Date()}`);
    }
  }
}

export default [
  takeLatest(contents.RELOAD,reorder),
  takeLatest(actions.SEARCH_TWEETS,searchTweets),
  takeEvery(actions.MOUNT_COMPONENT,initialize),
]
