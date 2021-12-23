import * as timeline from "./timeline";
import * as search from "./search";
import * as timer from "./timer";

export function* launch(target: TheMoodyBlues.Store.Timeline) {
  switch (target.preference.component) {
    case "Timeline":
      yield timeline.initialize(target);
      break;
    case "Search":
      yield search.initialize(target);
      break;
    default:
      throw new Error(target.preference.component);
  }
}
export function* play(target: TheMoodyBlues.Store.Timeline, agent: TheMoodyBlues.TwitterAgent, force: boolean) {
  switch (target.preference.component) {
    case "Timeline":
      yield timeline.order(target, agent, force);
      break;
    case "Search":
      yield search.order(target, agent, force);
      break;
    default:
      throw new Error(target.preference.component);
  }
}
export function* close(identity: TheMoodyBlues.Store.TimelineIdentity) {
  yield timer.shutdown(identity);
}
