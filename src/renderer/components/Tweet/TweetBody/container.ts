import {connect} from "react-redux";
import Component from "./component";
import {searchTweets} from "../../../modules/home";

const mapDispatchToProps = {
  search: (event: React.SyntheticEvent) => searchTweets((event.target as HTMLElement).textContent!),
};
export default connect(
  null,
  mapDispatchToProps
)(Component);
