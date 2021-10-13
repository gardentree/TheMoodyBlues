import {connect} from "react-redux";
import Component from "./component";
import {OwnProperty, StateProperty, DispatchProperty} from "./component";
import * as home from "../../modules/home";

const mapStateToProps = (state: TheMoodyBlues.State, own: OwnProperty): StateProperty => {
  const {timelines} = state.home;
  const timeline = timelines.get(own.identity);

  if (!timeline) return {tweets: [], lastReadID: 0};

  return {
    tweets: timeline.tweets || [],
    lastReadID: timeline.state.lastReadID || 0,
  };
};
const mapDispatchToProps = (dispatch: any, own: OwnProperty): DispatchProperty => {
  return {
    didMount: () => dispatch(home.mountComponent(own.identity)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
