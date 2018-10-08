import {connect} from "react-redux";
import Component from "./Search";
import {reduxForm} from "redux-form";
import * as home from "../../modules/home";

const mapStateToProps = (state: any) => {
  const {contents} = state.home;
  const content = contents["Search"];
  if (!content) return {tweets: []};

  return {
    tweets: content.tweets || [],
    lastReadID: content.lastReadID || 0,
    initialValues: {query: content.query},
  };
};
const mapDispatchToProps = {
  search: (values: any) => home.searchTweets(values.query),
  didMount: () => home.mountComponent("Search"),
};

let container: any = Component;
container = reduxForm({
  form: "Search",
  enableReinitialize: true,
})(container);
container = connect(
  mapStateToProps,
  mapDispatchToProps
)(container);

export default container;
