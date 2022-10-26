import * as effects from "redux-saga/effects";
import * as actions from "@actions";
import * as DateUtility from "date-fns";

export function* spawn(identifier: TMB.ScreenID, interval: number) {
  yield effects.spawn(run, identifier, interval * 1000);
}
function* run(identifier: TMB.ScreenID, interval: number) {
  const channel: string = yield effects.actionChannel(`${identifier}_START_TIMER`);

  while ((yield effects.take(channel)) as ReturnType<typeof effects.take>) {
    while (true) {
      yield effects.put(actions.updateScreenStatus({identifier, status: `next update ${DateUtility.format(Date.now() + interval, "HH:mm:ss")}`}));

      const winner: {stopped: boolean; killed: boolean; tick: boolean} = yield effects.race({
        stopped: effects.take(`${identifier}_STOP_TIMER`),
        killed: effects.take(`${identifier}_SHUTDOWN`),
        tick: effects.delay(interval),
      });

      if (winner.stopped) {
        break;
      }
      if (winner.killed) {
        yield effects.put(actions.updateScreenStatus({identifier, status: ""}));
        return;
      }

      yield effects.put(actions.reload(identifier, false, true));
    }
  }
}
export function* start(identifier: TMB.ScreenID) {
  yield effects.put({type: `${identifier}_START_TIMER`});
}
export function* stop(identifier: TMB.ScreenID) {
  yield effects.put({type: `${identifier}_STOP_TIMER`});
}
export function* shutdown(identifier: TMB.ScreenID) {
  yield effects.put({type: `${identifier}_SHUTDOWN`});
}
export function* restart(identifier: TMB.ScreenID) {
  yield stop(identifier);
  yield start(identifier);
}
