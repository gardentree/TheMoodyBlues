import * as React from "react";
import {connect} from "react-redux";
import TweetList from "./TweetList";
import {mountComponent} from "../modules/home";

class Timeline extends React.Component<any, any> {
  render() {
    return <TweetList tweets={this.props.tweets} lastReadID={this.props.lastReadID} />;
  }

  componentDidMount() {
    this.props.dispatch(mountComponent("Timeline"));
  }
}

const mapStateToProps = (state: any) => {
  const {contents} = state.home;

  if (!contents["Timeline"]) return {tweets: []};
  return {
    tweets: contents["Timeline"].tweets || [],
    lastReadID: contents["Timeline"].lastReadID || 0,
  };
};
const container = connect(mapStateToProps)(Timeline);
export default container;
