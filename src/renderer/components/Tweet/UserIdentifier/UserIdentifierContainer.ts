import {connect} from "react-redux";
import Component from "./UserIdentifier";
import {displayUserTimeline} from "../../../modules/home";

const mapDispatchToProps = {
  showUserTimeline: (event: React.SyntheticEvent) => {
    const target = event.target as HTMLElement;
    return displayUserTimeline(target.textContent!);
  },
};

export default connect(
  null,
  mapDispatchToProps
)(Component);
