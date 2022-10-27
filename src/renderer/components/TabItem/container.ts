import adapters from "@libraries/adapter";
import {connect} from "react-redux";
import Component, {OwnProps, StateProps} from "./component";

const mapStateToProps = (state: TMB.State, own: OwnProps): StateProps => {
  const {screens, preferences} = state;
  const screen = adapters.screens.getSelectors().selectById(screens, own.identifier)!;
  const preference = adapters.preferences.getSelectors().selectById(preferences, own.identifier)!;

  const {tweets, lastReadID} = screen;
  const unread = tweets ? tweets.filter((tweet: Twitter.Tweet) => tweet.id_str > lastReadID).length : 0;

  return {
    title: preference.title,
    unread,
  };
};
export default connect(mapStateToProps)(Component);
