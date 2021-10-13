import * as React from "react";
import TweetList from "../TweetList";

export interface OwnProperty {
  identity: string;
}
export interface StateProperty {
  tweets: TweetType[];
  lastReadID: number;
}
export interface DispatchProperty {
  didMount: any;
}

type Property = OwnProperty & StateProperty & DispatchProperty;

export default class Timeline extends React.Component<Property, {}> {
  render() {
    const {tweets, lastReadID} = this.props;

    return <TweetList tweets={tweets} lastReadID={lastReadID} />;
  }

  componentDidMount() {
    this.props.didMount();
  }
}
