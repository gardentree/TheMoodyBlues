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

export async function loadPreferences(): Promise<TMB.NormalizedScreenPreference> {
  return await facade.storage.getScreenPreferences();
}

export function mixPreferences(current: TMB.NormalizedScreenPreference, lists: Twitter.List[]): TMB.NormalizedScreenPreference {
  let allPreference = adapters.preferences.getInitialState();
  const selector = adapters.preferences.getSelectors();

  allPreference = adapters.preferences.addOne(allPreference, selector.selectById(current, HOME.identifier)!);

  for (const list of lists) {
    const identifier = `list_${list.id_str}`;
    const currentList = selector.selectById(current, identifier);
    if (currentList) {
      allPreference = adapters.preferences.addOne(allPreference, currentList);
    } else {
      const newList = Object.assign({}, LIST, {active: true, identifier: identifier, title: list.name, parameters: [list.id_str]});
      allPreference = adapters.preferences.addOne(allPreference, newList);
    }
  }

  allPreference = adapters.preferences.addOne(allPreference, selector.selectById(current, SEARCH.identifier)!);
  allPreference = adapters.preferences.addOne(allPreference, selector.selectById(current, MENTIONS.identifier)!);

  return allPreference;
}
