import {connect} from "react-redux";
import Component from "./Tweet";
import {searchTweets, displayConversation} from "../../modules/home";

const mapDispatchToProps = {
  search: (keyword: string) => searchTweets(keyword),
  converse: (tweet: TweetType) => displayConversation(tweet),
};
export default connect(
  null,
  mapDispatchToProps
)(Component);
