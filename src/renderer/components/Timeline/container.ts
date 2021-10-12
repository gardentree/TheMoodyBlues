import {connect} from "react-redux";
import Component from "./component";
import {OwnProperty, StateProperty, DispatchProperty} from "./component";
import * as home from "../../modules/home";

const mapStateToProps = (state: any, own: OwnProperty): StateProperty => {
  const {contents} = state.home;
  const content = contents[own.name];

  if (!content) return {tweets: [], lastReadID: 0};

  return {
    tweets: content.tweets || [],
    lastReadID: content.lastReadID || 0,
  };
};
const mapDispatchToProps = (dispatch: any, own: OwnProperty): DispatchProperty => {
  return {
    didMount: () => dispatch(home.mountComponent(own.name)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
