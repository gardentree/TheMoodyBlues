import {connect} from "react-redux";
import Component from "./component";
import {OwnProperty, StateProperty, DispatchProperty} from "./component";
import * as timelines from "@modules/timelines";

const mapStateToProps = (state: TheMoodyBlues.Store.State, own: OwnProperty): StateProperty => {
  const {timelines} = state;
  const timeline = timelines.get(own.identity)!;

  return {
    tweets: timeline.tweets || [],
    lastReadID: timeline.state.lastReadID,
  };
};
const mapDispatchToProps = (dispatch: any, own: OwnProperty): DispatchProperty => {
  return {
    didMount: () => dispatch(timelines.mountComponent(own.identity)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
