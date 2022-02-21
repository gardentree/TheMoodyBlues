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

export function* launch(identity: TheMoodyBlues.TimelineIdentity, preference: TheMoodyBlues.TimelinePreference) {
  yield components[preference.component].initialize(identity, preference);
}
export function* play(identity: TheMoodyBlues.TimelineIdentity, timeline: TheMoodyBlues.Timeline, preference: TheMoodyBlues.Preference, force: boolean) {
  yield components[preference.timeline.component].order(identity, timeline, preference, force);
}
export function* close(identity: TheMoodyBlues.TimelineIdentity) {
  yield timer.shutdown(identity);
}
