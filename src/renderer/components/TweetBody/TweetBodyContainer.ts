import {connect} from "react-redux";
import Component from "./TweetBody";
import * as actions from "../../actions";

const mapDispatchToProps = {
  search: (event: React.SyntheticEvent) => actions.searchTweets((event.target as HTMLElement).textContent!),
};
export default connect(
  null,
  mapDispatchToProps
)(Component);
