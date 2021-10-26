import {connect} from "react-redux";
import Component, {OwnProperty, DispatchProperty} from "./component";
import * as timelines from "@modules/timelines";

const mapDispatchToProps = (dispatch: any, ownProps: OwnProperty): DispatchProperty => ({
  onScroll: (event: React.SyntheticEvent<HTMLElement>): void => {
    const {identity, tweets, lastReadID} = ownProps;
    if ((event.target as HTMLElement).scrollTop <= 0 && tweets.length > 0 && lastReadID < tweets[0].id) {
      dispatch(timelines.read(identity, tweets[0].id));
    }
  },
});
export default connect(null, mapDispatchToProps)(Component);
