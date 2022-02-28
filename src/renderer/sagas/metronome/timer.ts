import * as effects from "redux-saga/effects";
import * as actions from "@actions";

export function* spawn(identity: TMB.ScreenID, interval: number) {
  yield effects.spawn(run, identity, interval * 1000);
}
function* run(identity: TMB.ScreenID, interval: number) {
  const channel: string = yield effects.actionChannel(`${identity}_START_TIMER`);

  const wait = (ms: number) =>
    new Promise<void>((resolve) => {
      setTimeout(() => resolve(), ms);
    });
  while ((yield effects.take(channel)) as ReturnType<typeof effects.take>) {
    while (true) {
      const winner: {stopped: boolean; killed: boolean; tick: boolean} = yield effects.race({
        stopped: effects.take(`${identity}_STOP_TIMER`),
        killed: effects.take(`${identity}_SHUTDOWN`),
        tick: effects.call(wait, interval),
      });

      if (winner.stopped) {
        break;
      }
      if (winner.killed) {
        yield effects.put(actions.updateScreenState(identity, "killed"));
        return;
      }

      yield effects.put(actions.reload(false, identity, true));
    }
  }
}
export function* start(identity: TMB.ScreenID) {
  yield effects.put({type: `${identity}_START_TIMER`});
}
export function* stop(identity: TMB.ScreenID) {
  yield effects.put({type: `${identity}_STOP_TIMER`});
}
export function* shutdown(identity: TMB.ScreenID) {
  yield effects.put({type: `${identity}_SHUTDOWN`});
}
export function* restart(identity: TMB.ScreenID) {
  yield stop(identity);
  yield start(identity);
}
