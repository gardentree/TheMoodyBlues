import {connect} from "react-redux";
import Component from "./TweetList";
import * as home from "../../modules/home";

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({
  onScroll: (event: React.SyntheticEvent<HTMLElement>): void => {
    const {tweets, lastReadID} = ownProps;
    if ((event.target as HTMLElement).scrollTop <= 0 && tweets.length > 0 && lastReadID < tweets[0].id) {
      dispatch(home.read(tweets[0].id));
    }
  },
});
export default connect(
  null,
  mapDispatchToProps
)(Component);
