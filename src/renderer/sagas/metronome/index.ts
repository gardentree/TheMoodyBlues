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

export function* launch(identity: TMB.TimelineIdentity, preference: TMB.TimelinePreference) {
  yield components[preference.component].initialize(identity, preference);
}
export function* play(identity: TMB.TimelineIdentity, timeline: TMB.Timeline, preference: TMB.Preference, force: boolean) {
  yield components[preference.timeline.component].order(identity, timeline, preference, force);
}
export function* close(identity: TMB.TimelineIdentity) {
  yield timer.shutdown(identity);
}
