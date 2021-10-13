import {connect} from "react-redux";
import Component from "./component";
import * as home from "../../modules/home";

const mapStateToProps = (state: TheMoodyBlues.State) => {
  const {tab, style, timelines, subcontents, nowLoading} = state.home;

  let unreads = {};
  if (timelines) {
    Object.entries(timelines).forEach(([identity, timeline]) => {
      const {
        tweets,
        state: {lastReadID},
      } = timeline;
      let count = tweets ? tweets.filter((tweet: TweetType) => tweet.id > lastReadID).length : 0;
      if (count <= 0) count = null;

      unreads[identity] = count;
    });
  }

  return {
    current: tab,
    style: style,
    unreads: unreads,
    subcontents: subcontents,
    nowLoading: nowLoading,
    timelines: timelines,
  };
};
const mapDispatchToProps = {
  onClick: (event: React.SyntheticEvent<HTMLElement>) => home.selectTab(event.currentTarget.dataset.name),
  didMount: (identity: string) => home.selectTab(identity),
};
export default connect(mapStateToProps, mapDispatchToProps)(Component);
