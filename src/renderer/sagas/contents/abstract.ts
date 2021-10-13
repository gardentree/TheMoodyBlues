import {put, call, actionChannel, race, take, spawn} from "redux-saga/effects";
import * as home from "../../modules/home";

export default abstract class ComponentSaga {
  account: any;
  timeline: TheMoodyBlues.Timeline;

  constructor(account: any, timeline: TheMoodyBlues.Timeline) {
    this.account = account;
    this.timeline = timeline;
  }

  abstract initialize(action: TheMoodyBlues.HomeAction): any;
  abstract order(action: ActionType): any;

  protected *spawnTimer() {
    yield spawn(this.runTimer, this.timeline.meta.identity, this.timeline.meta.interval * 1000);
  }
  protected *runTimer(identity: string, interval: number) {
    const channel: string = yield actionChannel(`${identity}_START_TIMER`);

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        setTimeout(() => resolve(), ms);
      });
    while ((yield take(channel)) as ReturnType<typeof take>) {
      while (true) {
        const winner: {stopped: boolean; tick: any} = yield race({
          stopped: take(`${identity}_STOP_TIMER`),
          tick: call(wait, interval),
        });

        if (winner.stopped) {
          break;
        }

        yield put(home.reload(false, identity, true));
        console.log(`reload ${identity}: ${new Date()}`);
      }
    }
  }
  protected *startTimer() {
    yield put({type: `${this.timeline.meta.identity}_START_TIMER`});
  }
  protected *stopTimer() {
    yield put({type: `${this.timeline.meta.identity}_STOP_TIMER`});
  }
  protected *restartTimer() {
    yield this.stopTimer();
    yield this.startTimer();
  }

  protected latest(): string | null {
    return this.timeline.tweets.length > 0 ? this.timeline.tweets[0].id_str : null;
  }
}
