import {connect} from "react-redux";
import {Dispatch} from "redux";
import Component from "./component";
import {OwnProperty, StateProperty, DispatchProperty} from "./component";
import * as actions from "@actions";

const mapStateToProps = (state: TMB.State, own: OwnProperty): StateProperty => {
  const {timelines} = state;
  const timeline = timelines.get(own.identity)!;

  return {
    tweets: timeline.tweets || [],
    mode: timeline.mode,
    lastReadID: timeline.state.lastReadID,
  };
};
const mapDispatchToProps = (dispatch: Dispatch, own: OwnProperty): DispatchProperty => {
  return {
    didMount: () => dispatch(actions.mountComponent(own.identity)),
    willUnmount: () => dispatch(actions.unmountComponent(own.identity)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
