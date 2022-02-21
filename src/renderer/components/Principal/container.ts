import {connect} from "react-redux";
import Component, {StateProps, DispatchProps, Content, TabItem} from "./component";
import * as principal from "@modules/principal";
import Timeline from "../Timeline";
import Search from "../Search";

const components = new Map<string, Content>([
  ["Timeline", Timeline],
  ["Search", Search],
]);

const mapStateToProps = (state: TMB.State): StateProps => {
  const {timelines, subcontents, preferences} = state;
  const {contents, focused, style, nowLoading} = state.principal;

  const unreads = {};
  for (const identity of contents) {
    const timeline = timelines.get(identity)!;
    const {
      tweets,
      state: {lastReadID},
    } = timeline;
    let count = tweets ? tweets.filter((tweet: Twitter.Tweet) => tweet.id_str > lastReadID).length : 0;
    if (count <= 0) count = 0;

    unreads[identity] = count;
  }

  const items: TabItem[] = contents.map((identity) => {
    const preference = preferences.get(identity)!;

    return {
      identity: identity,
      title: preference.timeline.title,
      component: components.get(preference.timeline.component)!,
    };
  });

  return {
    current: focused,
    style: style,
    unreads: unreads,
    subcontents: subcontents,
    nowLoading: nowLoading,
    items: items,
  };
};
const mapDispatchToProps: DispatchProps = {
  onClick: (event: React.SyntheticEvent<HTMLElement>) => principal.selectTab(event.currentTarget.dataset.name),
  didMount: (identity: string) => principal.selectTab(identity),
};
export default connect(mapStateToProps, mapDispatchToProps)(Component);
