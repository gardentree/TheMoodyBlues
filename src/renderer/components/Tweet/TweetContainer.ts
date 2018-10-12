import {connect} from "react-redux";
import Component from "./Tweet";
import {searchTweets} from "../../modules/home";

const mapDispatchToProps = {
  search: (keyword: string) => searchTweets(keyword),
};
export default connect(
  null,
  mapDispatchToProps
)(Component);
