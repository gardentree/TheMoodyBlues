import {connect} from "react-redux";
import {Dispatch} from "redux";
import Component from "./component";
import {OwnProperty, StateProperty, DispatchProperty} from "./component";
import {formValueSelector} from "redux-form";
import * as timelines from "@modules/timelines";

const mapStateToProps = (state: TMB.State, own: OwnProperty): StateProperty => {
  const {timelines} = state;
  const timeline = timelines.get(own.identity)!;

  const selector = formValueSelector("Search");
  const query = selector(state, "query");

  return {
    tweets: timeline.tweets || [],
    mode: timeline.mode,
    lastReadID: timeline.state.lastReadID,
    initialValues: {query: timeline.state.query!},
    hasQuery: query && query.length > 0,
  };
};
const mapDispatchToProps = (dispatch: Dispatch, own: OwnProperty): DispatchProperty => {
  return {
    search: (values: {query: string}) => dispatch(timelines.searchTweets(values.query)),
    didMount: () => dispatch(timelines.mountComponent(own.identity)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
