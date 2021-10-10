import * as React from "react";
import TweetList from "../TweetList";

interface Property {
  tweets: TweetType[];
  lastReadID: number;
  didMount: any;
}

export default class Timeline extends React.Component<Property, {}> {
  render() {
    const {tweets, lastReadID} = this.props;

    return <TweetList tweets={tweets} lastReadID={lastReadID} />;
  }

  componentDidMount() {
    this.props.didMount();
  }
}
