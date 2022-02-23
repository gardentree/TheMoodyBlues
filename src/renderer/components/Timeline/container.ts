import {connect} from "react-redux";
import {Dispatch} from "redux";
import Component from "./component";
import {OwnProps, StateProps, DispatchProps} from "./component";
import * as actions from "@actions";

const mapStateToProps = (state: TMB.State, own: OwnProps): StateProps => {
  const {screens, lineage} = state;
  const screen = screens.get(own.identity)!;
  const branches = lineage.get(own.identity) || [];

  return {
    ...screen,
    branches,
  };
};
const mapDispatchToProps = (dispatch: Dispatch, own: OwnProps): DispatchProps => {
  return {
    didMount: () => dispatch(actions.mountScreen(own.identity)),
    willUnmount: () => dispatch(actions.unmountScreen(own.identity)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
