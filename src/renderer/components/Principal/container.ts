import {connect} from "react-redux";
import Component, {DispatchProps} from "./component";
import * as actions from "@actions";

const mapStateToProps = (state: TMB.State): TMB.Principal => {
  const {principal} = state;

  return principal;
};
const mapDispatchToProps: DispatchProps = {
  focusScreen: (event: React.SyntheticEvent<HTMLElement>) => actions.focusScreen(event.currentTarget.dataset.name!),
  focus: (identifier: TMB.ScreenID) => actions.focusScreen(identifier),
};
export default connect(mapStateToProps, mapDispatchToProps)(Component);
