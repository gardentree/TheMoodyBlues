import {Dispatch} from "redux";
import {connect} from "react-redux";
import Component, {StateProps, DispatchProps} from "./component";
import * as actions from "@actions";

const mapStateToProps = (state: TMB.State): StateProps => {
  const {dialog} = state.principal;

  return {dialog};
};
const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  requestClose: () => dispatch(actions.closeDialog()),
});
export default connect(mapStateToProps, mapDispatchToProps)(Component);
