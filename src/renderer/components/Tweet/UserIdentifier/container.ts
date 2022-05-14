import {connect} from "react-redux";
import Component, {DispatchProps} from "./component";
import * as actions from "@actions";

const mapDispatchToProps: DispatchProps = {
  showUserTimeline: (event: React.SyntheticEvent) => {
    const target = event.target as HTMLElement;
    return actions.displayUserTimeline(target.textContent!);
  },
};

export default connect(null, mapDispatchToProps)(Component);
