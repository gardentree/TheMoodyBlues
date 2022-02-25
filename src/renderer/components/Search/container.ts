import {Dispatch} from "redux";
import {connect} from "react-redux";
import Component,{OwnProps, StateProps, DispatchProps} from "./component";
import {formValueSelector} from "redux-form";
import * as actions from "@actions";

const mapStateToProps = (state: TMB.State, own: OwnProps): StateProps => {
  const {screens, lineage} = state;
  const screen = screens.get(own.identity)!;
  const branches = lineage.get(own.identity) || [];

  const selector = formValueSelector("Search");
  const query = selector(state, "query");

  return {
    initialValues: {query: screen.options?.query || ""},
    hasQuery: query && query.length > 0,
    branches,
  };
};
const mapDispatchToProps = (dispatch: Dispatch, own: OwnProps): DispatchProps => {
  return {
    search: (values: {query: string}) => dispatch(actions.searchTweets(values.query)),
    didMount: () => dispatch(actions.mountScreen(own.identity)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
