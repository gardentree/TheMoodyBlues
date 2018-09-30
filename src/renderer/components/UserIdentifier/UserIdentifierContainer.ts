import {connect} from "react-redux";
import Component from "./UserIdentifier";
import * as subcontents from "../../modules/subcontents";

const mapDispatchToProps = {
  showUserTimeline: (event: React.SyntheticEvent) => {
    const target = event.target as HTMLElement;
    return subcontents.displayUserTimeline(target.textContent!);
  },
};

export default connect(
  null,
  mapDispatchToProps
)(Component);
