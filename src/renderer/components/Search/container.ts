import {connect} from "react-redux";
import Component from "./component";
import {OwnProperty, StateProperty, DispatchProperty} from "./component";
import {reduxForm, formValueSelector} from "redux-form";
import * as home from "../../modules/home";

const mapStateToProps = (state: TheMoodyBlues.State, own: OwnProperty): StateProperty => {
  const {timelines} = state.home;
  const timeline = timelines.get(own.identity)!;

  const selector = formValueSelector("Search");
  const query = selector(state, "query");

  return {
    tweets: timeline.tweets || [],
    lastReadID: timeline.state.lastReadID || 0,
    initialValues: {query: timeline.state.query!},
    hasQuery: query && query.length > 0,
  };
};
const mapDispatchToProps = (dispatch: any, own: OwnProperty): DispatchProperty => {
  return {
    search: (values: any) => dispatch(home.searchTweets(values.query)),
    didMount: () => dispatch(home.mountComponent(own.identity)),
  };
};

let container: any = Component;
container = reduxForm({
  form: "Search",
  enableReinitialize: true,
})(container);
container = connect(mapStateToProps, mapDispatchToProps)(container);

export default container;
