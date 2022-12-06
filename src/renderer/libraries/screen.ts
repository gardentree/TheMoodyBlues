import {HOME, SEARCH, MENTIONS, LIST} from "@shared/defaults";
import adapters from "./adapter";

export const INITIAL_VALUE: TMB.Screen = {
  identifier: "",
  tweets: [],
  mode: "tweet",
  lastReadID: "",
  status: {
    status: "",
  },
};

export function mixPreferences(current: TMB.NormalizedBackstage, lists: Twitter.List[]): TMB.NormalizedBackstage {
  let allPreference = adapters.backstages.getInitialState();
  const selector = adapters.backstages.getSelectors();

  allPreference = adapters.backstages.addOne(allPreference, selector.selectById(current, HOME.identifier)!);

  for (const list of lists) {
    const identifier = `list_${list.id_str}`;
    const currentList = selector.selectById(current, identifier);
    if (currentList) {
      allPreference = adapters.backstages.addOne(allPreference, currentList);
    } else {
      const newList = Object.assign({}, LIST, {active: true, identifier: identifier, title: list.name, parameters: [list.id_str]});
      allPreference = adapters.backstages.addOne(allPreference, newList);
    }
  }

  allPreference = adapters.backstages.addOne(allPreference, selector.selectById(current, SEARCH.identifier)!);
  allPreference = adapters.backstages.addOne(allPreference, selector.selectById(current, MENTIONS.identifier)!);

  return allPreference;
}
