import {connect} from "react-redux";
import Component from "./Timeline";
import * as home from "../../modules/home";

export default (name: string) => {
  const mapStateToProps = (state: any) => {
    const {contents} = state.home;
    const content = contents[name];

    if (!content) return {tweets: [], lastReadID: 0};

    return {
      tweets: content.tweets || [],
      lastReadID: content.lastReadID || 0,
    };
  };
  const mapDispatchToProps = {
    didMount: () => home.mountComponent(name),
  };

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(Component);
};
