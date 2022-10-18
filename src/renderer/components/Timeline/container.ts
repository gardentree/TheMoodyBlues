import {Dispatch} from "redux";
import {connect} from "react-redux";
import Component, {OwnProps, StateProps, DispatchProps} from "./component";
import * as actions from "@actions";
import adapters from "@libraries/adapter";

const mapStateToProps = (state: TMB.State, own: OwnProps): StateProps => {
  const {lineage} = state;
  const branches = adapters.lineage.getSelectors().selectById(lineage, own.identity)?.branches || [];

  return {
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
