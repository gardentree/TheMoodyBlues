import * as effects from "redux-saga/effects";
import * as modules from "@modules/timelines";

export function* spawn(identity: TheMoodyBlues.Store.TimelineIdentity, interval: number) {
  yield effects.spawn(run, identity, interval * 1000);
}
function* run(identity: TheMoodyBlues.Store.TimelineIdentity, interval: number) {
  const channel: string = yield effects.actionChannel(`${identity}_START_TIMER`);

  const wait = (ms: number) =>
    new Promise<void>((resolve) => {
      setTimeout(() => resolve(), ms);
    });
  while ((yield effects.take(channel)) as ReturnType<typeof effects.take>) {
    while (true) {
      const winner: {stopped: boolean; killed: boolean; tick: any} = yield effects.race({
        stopped: effects.take(`${identity}_STOP_TIMER`),
        killed: effects.take(`${identity}_SHUTDOWN`),
        tick: effects.call(wait, interval),
      });

      if (winner.stopped) {
        break;
      }
      if (winner.killed) {
        return;
      }

      yield effects.put(modules.reload(false, identity, true));
      console.log(`reload ${identity}: ${new Date()}`);
    }
  }
}
export function* start(identity: TheMoodyBlues.Store.TimelineIdentity) {
  yield effects.put({type: `${identity}_START_TIMER`});
}
export function* stop(identity: TheMoodyBlues.Store.TimelineIdentity) {
  yield effects.put({type: `${identity}_STOP_TIMER`});
}
export function* shutdown(identity: TheMoodyBlues.Store.TimelineIdentity) {
  yield effects.put({type: `${identity}_SHUTDOWN`});
}
export function* restart(identity: TheMoodyBlues.Store.TimelineIdentity) {
  yield stop(identity);
  yield start(identity);
}
