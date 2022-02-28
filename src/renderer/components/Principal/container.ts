import {connect} from "react-redux";
import Component, {StateProps, DispatchProps, ContentComponent, ScreenContent} from "./component";
import * as actions from "@actions";
import Timeline from "../Timeline";
import Search from "../Search";

const components = new Map<string, ContentComponent>([
  ["Timeline", Timeline],
  ["Search", Search],
]);

const mapStateToProps = (state: TMB.State): StateProps => {
  const {screens: screenMap, preferences} = state;
  const {screens, focused, style, nowLoading} = state.principal;

  const unreads = {};
  for (const identity of screens) {
    const screen = screenMap.get(identity)!;
    const {tweets, lastReadID} = screen;
    let count = tweets ? tweets.filter((tweet: Twitter.Tweet) => tweet.id_str > lastReadID).length : 0;
    if (count <= 0) count = 0;

    unreads[identity] = count;
  }

  const contents: ScreenContent[] = screens.map((identity) => {
    const preference = preferences.get(identity)!;

    return {
      identity: identity,
      title: preference.screen.title,
      component: components.get(preference.screen.component)!,
    };
  });

  return {
    current: focused,
    style: style,
    unreads: unreads,
    nowLoading: nowLoading,
    contents: contents,
  };
};
const mapDispatchToProps: DispatchProps = {
  onClick: (event: React.SyntheticEvent<HTMLElement>) => actions.focusScreen(event.currentTarget.dataset.name),
  didMount: (identity: string) => actions.focusScreen(identity),
};
export default connect(mapStateToProps, mapDispatchToProps)(Component);
