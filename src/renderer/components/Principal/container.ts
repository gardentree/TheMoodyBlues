import {connect} from "react-redux";
import Component, {StateProps, DispatchProps} from "./component";
import * as principal from "@modules/principal";

const mapStateToProps = (state: TheMoodyBlues.State): StateProps => {
  const {timelines, subcontents} = state;
  const {focused, style, nowLoading} = state.principal;

  const unreads = {};
  if (timelines) {
    for (const [identity, timeline] of timelines.entries()) {
      const {
        tweets,
        state: {lastReadID},
      } = timeline;
      let count = tweets ? tweets.filter((tweet: Twitter.Tweet) => tweet.id_str > lastReadID).length : 0;
      if (count <= 0) count = 0;

      unreads[identity] = count;
    }
  }

  return {
    current: focused,
    style: style,
    unreads: unreads,
    subcontents: subcontents,
    nowLoading: nowLoading,
    timelines: timelines,
  };
};
const mapDispatchToProps: DispatchProps = {
  onClick: (event: React.SyntheticEvent<HTMLElement>) => principal.selectTab(event.currentTarget.dataset.name),
  didMount: (identity: string) => principal.selectTab(identity),
};
export default connect(mapStateToProps, mapDispatchToProps)(Component);
