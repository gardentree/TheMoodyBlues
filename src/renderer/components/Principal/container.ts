import {connect} from "react-redux";
import Component, {StateProps, DispatchProps} from "./component";
import * as actions from "@actions";

const mapStateToProps = (state: TMB.State): StateProps => {
  const {screens, focused, style, nowLoading} = state.principal;

  return {
    screens: screens,
    focused: focused,
    style: style,
    nowLoading: nowLoading,
  };
};
const mapDispatchToProps: DispatchProps = {
  focusScreen: (event: React.SyntheticEvent<HTMLElement>) => actions.focusScreen(event.currentTarget.dataset.name),
  didMount: (identity: string) => actions.focusScreen(identity),
};
export default connect(mapStateToProps, mapDispatchToProps)(Component);
