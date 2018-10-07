import {connect} from "react-redux";
import Component from "./Timeline";
import * as home from "../../modules/home";

const mapStateToProps = (state: any) => {
  const {contents} = state.home;
  const content = contents["Timeline"];

  if (!content) return {tweets: [], lastReadID: 0};

  return {
    tweets: content.tweets || [],
    lastReadID: content.lastReadID || 0,
  };
};
const mapDispatchToProps = {
  didMount: () => home.mountComponent("Timeline"),
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Component);
