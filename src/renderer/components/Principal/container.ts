import {connect} from "react-redux";
import Component, {DispatchProps} from "./component";
import * as actions from "@actions";

const mapStateToProps = (state: TMB.State): TMB.Principal => {
  const {principal} = state;

  return principal;
};
const mapDispatchToProps: DispatchProps = {
  focusScreen: (event: React.SyntheticEvent<HTMLElement>) => actions.focusScreen(event.currentTarget.dataset.name!),
  didMount: (identity: TMB.ScreenID) => actions.focusScreen(identity),
};
export default connect(mapStateToProps, mapDispatchToProps)(Component);
