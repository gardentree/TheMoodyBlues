import {connect} from "react-redux";
import Component from "./component";
import {searchTweets} from "@modules/timelines";

const mapDispatchToProps = {
  search: (event: React.SyntheticEvent) => searchTweets((event.target as HTMLElement).textContent!),
};
export default connect(null, mapDispatchToProps)(Component);
