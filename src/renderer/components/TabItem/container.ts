import {connect} from "react-redux";
import Component, {OwnProps, StateProps} from "./component";

const mapStateToProps = (state: TMB.State, own: OwnProps): StateProps => {
  const {screens, preferences} = state;
  const screen = screens.get(own.identity)!;
  const preference = preferences.get(own.identity)!;

  const {tweets, lastReadID} = screen;
  const unread = tweets ? tweets.filter((tweet: Twitter.Tweet) => tweet.id_str > lastReadID).length : 0;

  return {
    title: preference.screen.title,
    unread,
  };
};
export default connect(mapStateToProps)(Component);
