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

export function* launch(identifier: TMB.ScreenID, preference: TMB.ScreenPreference) {
  yield components[preference.component].initialize(identifier, preference);
}
export function* play(identifier: TMB.ScreenID, screen: TMB.Screen, preference: TMB.Preference, force: boolean) {
  yield components[preference.screen.component].order(identifier, screen, preference, force);
}
export function* close(identifier: TMB.ScreenID) {
  yield timer.shutdown(identifier);
}
