import {connect} from "react-redux";
import Component from "./Tweet";
import * as twitter from "../../others/twitter";
import {searchTweets, displayConversation} from "../../modules/home";

const mapDispatchToProps = {
  search: (keyword: string) => searchTweets(keyword),
  converse: (tweet: twitter.Tweet) => displayConversation(tweet),
};
export default connect(
  null,
  mapDispatchToProps
)(Component);
