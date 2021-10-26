import {connect} from "react-redux";
import Component from "./component";
import {OwnProperty, StateProperty, DispatchProperty} from "./component";
import * as timelines from "@modules/timelines";

const mapStateToProps = (state: TheMoodyBlues.Store.State, own: OwnProperty): StateProperty => {
  const {timelines} = state;
  const timeline = timelines.get(own.identity);

  if (!timeline) return {tweets: [], lastReadID: 0};

  return {
    tweets: timeline.tweets || [],
    lastReadID: timeline.state.lastReadID || 0,
  };
};
const mapDispatchToProps = (dispatch: any, own: OwnProperty): DispatchProperty => {
  return {
    didMount: () => dispatch(timelines.mountComponent(own.identity)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
