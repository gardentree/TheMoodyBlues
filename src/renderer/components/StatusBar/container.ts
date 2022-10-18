import adapters from "@libraries/adapter";
import {connect} from "react-redux";
import Component from "./component";

const mapStateToProps = (state: TMB.State): TMB.ScreenStatus => {
  const {screens, principal} = state;
  const screen = adapters.screens.getSelectors().selectById(screens, principal.focused);

  if (screen) {
    return screen.status;
  } else {
    return {
      status: "loading",
    };
  }
};
export default connect(mapStateToProps)(Component);
