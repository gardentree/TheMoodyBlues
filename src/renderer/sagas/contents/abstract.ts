import {put, call, actionChannel, race, take} from "redux-saga/effects";
import Action from "../../others/action";
import * as home from "../../modules/home";

export default abstract class ComponentSaga {
  account: any;
  content: any;

  constructor(account: any, content: any) {
    this.account = account;
    this.content = content;
  }

  abstract initialize(action: Action): IterableIterator<any>;
  abstract order(action: Action): IterableIterator<any>;

  protected *runTimer(tab: string, interval: number) {
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
  protected *restartTimer(name: string) {
    yield put({type: `${name}_STOP_TIMER`});
    yield put({type: `${name}_START_TIMER`});
  }

  protected latest(): string {
    return this.content.tweets.length > 0 ? this.content.tweets[0].id_str : null;
  }
}