import {HOME, SEARCH, MENTIONS, LIST} from "@shared/defaults";
import adapters from "./adapter";

const {facade} = window;

export const INITIAL_VALUE: TMB.Screen = {
  identifier: "",
  tweets: [],
  mode: "tweet",
  lastReadID: "",
  status: {
    status: "",
  },
};

export async function loadPreferences(): Promise<TMB.PreferenceMap> {
  const screens = await facade.storage.getScreenPreferences();
  const mute: TMB.MutePreference = await facade.storage.getMutePreference();

  return adapters.preferences.addMany(
    adapters.preferences.getInitialState(),
    screens.map((screen) => ({identifier: screen.identifier, screen, mute}))
  );
}

export function mixPreferences(actives: TMB.ScreenPreference[], lists: Twitter.List[]): TMB.ScreenPreference[] {
  const activeMap = new Map(actives.map((active) => [active.identifier, Object.assign({active: true}, active)]));

  const screens: TMB.ScreenPreference[] = [];
  screens.push(Object.assign({}, HOME, activeMap.get("home")));
  for (const list of lists) {
    const identifier = `list_${list.id_str}`;
    screens.push(Object.assign({active: true}, LIST, {identifier: identifier, title: list.name, parameters: [list.id_str]}, activeMap.get(identifier)));
  }
  screens.push(Object.assign({}, SEARCH, activeMap.get("search")));
  screens.push(Object.assign({}, MENTIONS, activeMap.get("mentions")));

  return screens;
}
