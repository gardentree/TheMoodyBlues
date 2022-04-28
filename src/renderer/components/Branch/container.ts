import {Dispatch} from "redux";
import {connect} from "react-redux";
import Component, {OwnProps, DispatchProps} from "./component";
import * as actions from "@actions";

const mapStateToProps = (state: TMB.State, own: OwnProps): TMB.Screen => {
  const {screens} = state;
  const screen = screens.get(own.identity)!;

  return screen;
};
const mapDispatchToProps = (dispatch: Dispatch, own: OwnProps): DispatchProps => ({
  onClose: () => dispatch(actions.clip(own.root, own.identity)),
  didMount: (source: Twitter.Tweet) => dispatch(actions.focusTweet(source)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Component);
