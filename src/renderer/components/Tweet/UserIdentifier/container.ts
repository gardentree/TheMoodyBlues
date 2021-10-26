import {connect} from "react-redux";
import Component from "./component";
import {displayUserTimeline} from "@modules/subcontents";

const mapDispatchToProps = {
  showUserTimeline: (event: React.SyntheticEvent) => {
    const target = event.target as HTMLElement;
    return displayUserTimeline(target.textContent!);
  },
};

export default connect(null, mapDispatchToProps)(Component);
