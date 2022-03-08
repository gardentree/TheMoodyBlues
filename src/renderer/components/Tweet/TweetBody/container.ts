import {connect} from "react-redux";
import Component, {DispatchProps} from "./component";
import * as actions from "@actions";

const mapDispatchToProps: DispatchProps = {
  search: (event: React.SyntheticEvent) => actions.searchTweets((event.target as HTMLElement).textContent!),
};
export default connect(null, mapDispatchToProps)(Component);
