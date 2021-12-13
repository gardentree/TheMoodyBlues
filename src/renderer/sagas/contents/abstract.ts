import {put, call, actionChannel, race, take, spawn} from "redux-saga/effects";
import * as timelines from "@modules/timelines";

export default abstract class ComponentSaga {
  agent: TheMoodyBlues.TwitterAgent;
  timeline: TheMoodyBlues.Store.Timeline;

  constructor(agent: TheMoodyBlues.TwitterAgent, timeline: TheMoodyBlues.Store.Timeline) {
    this.agent = agent;
    this.timeline = timeline;
  }

  abstract initialize(action: TheMoodyBlues.ReduxAction): any;
  abstract order(action: TheMoodyBlues.ReduxAction): any;

  protected *spawnTimer() {
    yield spawn(this.runTimer, this.timeline.preference.identity, this.timeline.preference.interval * 1000);
  }
  protected *runTimer(identity: string, interval: number) {
    const channel: string = yield actionChannel(`${identity}_START_TIMER`);

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        setTimeout(() => resolve(), ms);
      });
    while ((yield take(channel)) as ReturnType<typeof take>) {
      while (true) {
        const winner: {stopped: boolean; killed: boolean; tick: any} = yield race({
          stopped: take(`${identity}_STOP_TIMER`),
          killed: take(`${identity}_SHUTDOWN`),
          tick: call(wait, interval),
        });

        if (winner.stopped) {
          break;
        }
        if (winner.killed) {
          return;
        }

        yield put(timelines.reload(false, identity, true));
        console.log(`reload ${identity}: ${new Date()}`);
      }
    }
  }
  protected *startTimer() {
    yield put({type: `${this.timeline.preference.identity}_START_TIMER`});
  }
  protected *stopTimer() {
    yield put({type: `${this.timeline.preference.identity}_STOP_TIMER`});
  }
  protected *restartTimer() {
    yield this.stopTimer();
    yield this.startTimer();
  }

  protected latest(): string | null {
    return this.timeline.tweets.length > 0 ? this.timeline.tweets[0].id_str : null;
  }
}
