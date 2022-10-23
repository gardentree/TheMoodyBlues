import {HOME, SEARCH, MENTIONS, LIST} from "@shared/defaults";
import adapters from "./adapter";

const {facade} = window;

export const INITIAL_VALUE: TMB.Screen = {
  identity: "",
  tweets: [],
  mode: "tweet",
  lastReadID: "",
  status: {
    status: "",
  },
};

export async function loadPreferences(): Promise<TMB.PreferenceMap> {
  const screens = await facade.storage.getScreenPreferences();
  const mute: TMB.MutePreference = Object.assign(
    {
      keywords: [],
      retweetYourself: false,
      media: [],
    },
    await facade.storage.getMutePreference()
  );

  return adapters.preferences.addMany(
    adapters.preferences.getInitialState(),
    screens.map((screen) => ({identity: screen.identity, screen, mute}))
  );
}

export function mixPreferences(actives: TMB.ScreenPreference[], lists: Twitter.List[]): TMB.ScreenPreference[] {
  const activeMap = new Map(actives.map((active) => [active.identity, Object.assign({active: true}, active)]));

  const screens: TMB.ScreenPreference[] = [];
  screens.push(Object.assign({}, HOME, activeMap.get("home")));
  for (const list of lists) {
    const identity = `list_${list.id_str}`;
    screens.push(Object.assign({active: true}, LIST, {identity: identity, title: list.name, parameters: [list.id_str]}, activeMap.get(identity)));
  }
  screens.push(Object.assign({}, SEARCH, activeMap.get("search")));
  screens.push(Object.assign({}, MENTIONS, activeMap.get("mentions")));

  return screens;
}
