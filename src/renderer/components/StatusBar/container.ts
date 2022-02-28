import {connect} from "react-redux";
import Component, {StateProps} from "./component";

const mapStateToProps = (state: TMB.State): StateProps => {
  const {screens, principal} = state;
  const screen = screens.get(principal.focused);

  if (screen) {
    return {
      state: screen.state,
    };
  } else {
    return {
      state: null,
    };
  }
};
export default connect(mapStateToProps)(Component);
