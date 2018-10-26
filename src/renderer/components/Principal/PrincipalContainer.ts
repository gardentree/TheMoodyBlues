import {connect} from "react-redux";
import Component from "./Principal";
import * as home from "../../modules/home";
import {TweetType} from "../../types/twitter";

const mapStateToProps = (state: any) => {
  const {tab, style, contents, subcontents} = state.home;

  let unreads = {};
  if (contents) {
    Object.entries(contents).forEach(([tab, content]) => {
      const {tweets, lastReadID} = content as any;
      let count = tweets ? tweets.filter((tweet: TweetType) => tweet.id > lastReadID).length : 0;
      if (count <= 0) count = null;

      unreads[tab] = count;
    });
  }

  return {
    current: tab,
    style: style,
    unreads: unreads,
    subcontents: subcontents,
  };
};
const mapDispatchToProps = {
  onClick: (event: React.SyntheticEvent<HTMLElement>) => home.selectTab(event.currentTarget.dataset.name),
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Component);
