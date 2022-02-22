import {connect} from "react-redux";
import {Dispatch} from "redux";
import Component from "./component";
import {OwnProperty, StateProperty, DispatchProperty} from "./component";
import {formValueSelector} from "redux-form";
import * as actions from "@actions";

const mapStateToProps = (state: TMB.State, own: OwnProperty): StateProperty => {
  const {screens} = state;
  const screen = screens.get(own.identity)!;

  const selector = formValueSelector("Search");
  const query = selector(state, "query");

  return {
    ...screen,
    initialValues: {query: screen.options?.query || ""},
    hasQuery: query && query.length > 0,
  };
};
const mapDispatchToProps = (dispatch: Dispatch, own: OwnProperty): DispatchProperty => {
  return {
    search: (values: {query: string}) => dispatch(actions.searchTweets(values.query)),
    didMount: () => dispatch(actions.mountComponent(own.identity)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
