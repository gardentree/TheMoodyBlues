import * as timeline from "./timeline";
import * as search from "./search";
import * as timer from "./timer";

const components = {
  Timeline: {
    initialize: timeline.initialize,
    order: timeline.order,
  },
  Search: {
    initialize: search.initialize,
    order: search.order,
  },
};

export function* launch(target: TheMoodyBlues.Timeline) {
  yield components[target.preference.component].initialize(target);
}
export function* play(target: TheMoodyBlues.Timeline, force: boolean) {
  yield components[target.preference.component].order(target, force);
}
export function* close(identity: TheMoodyBlues.TimelineIdentity) {
  yield timer.shutdown(identity);
}
