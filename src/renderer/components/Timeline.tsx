import * as React from "react";
import {connect} from "react-redux";
import {TweetList} from "./TweetList";
import * as actions from "../actions";

class Timeline extends React.Component<any, any> {
  render() {
    return <TweetList tweets={this.props.tweets} />;
  }

  componentDidMount() {
    this.props.dispatch(actions.mountComponent("Timeline"));
  }
}

const mapStateToProps = (state: any) => {
  if (!state.contents["Timeline"]) return {tweets: []};
  return {
    tweets: state.contents["Timeline"].tweets || [],
  };
};
const container = connect(mapStateToProps)(Timeline);
export default container;
