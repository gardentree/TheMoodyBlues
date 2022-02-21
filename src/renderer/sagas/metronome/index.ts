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

export function* launch(identity: TMB.ScreenID, preference: TMB.ScreenPreference) {
  yield components[preference.component].initialize(identity, preference);
}
export function* play(identity: TMB.ScreenID, screen: TMB.Screen, preference: TMB.Preference, force: boolean) {
  yield components[preference.screen.component].order(identity, screen, preference, force);
}
export function* close(identity: TMB.ScreenID) {
  yield timer.shutdown(identity);
}
