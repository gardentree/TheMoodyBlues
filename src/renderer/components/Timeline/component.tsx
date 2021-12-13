import * as React from "react";
import TweetList from "../TweetList";

export interface OwnProperty {
  identity: string;
}
export interface StateProperty {
  tweets: Twitter.Tweet[];
  lastReadID: string;
}
export interface DispatchProperty {
  didMount: any;
  willUnmount(): void;
}

type Property = OwnProperty & StateProperty & DispatchProperty;

export default class Timeline extends React.Component<Property, {}> {
  render() {
    const {identity, tweets, lastReadID} = this.props;

    return <TweetList identity={identity} tweets={tweets} lastReadID={lastReadID} />;
  }

  componentDidMount() {
    this.props.didMount();
  }
  componentWillUnmount() {
    this.props.willUnmount();
  }
}
