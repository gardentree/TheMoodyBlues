import * as React from "react";
import Tweet from "../Tweet";
import * as twitter from "../../others/twitter";

interface Property {
  tweets: twitter.Tweet[];
  lastReadID: number;
  onScroll: any;
}

export default class TweetList extends React.Component<Property, {}> {
  constructor(property: Property) {
    super(property);
  }

  render() {
    const {tweets, lastReadID, onScroll} = this.props;
    const elements = tweets.map((tweet) => {
      const unread = lastReadID > 0 && tweet.id > lastReadID;
      return (
        <li key={tweet.id_str} data-id={tweet.id_str} className={unread ? "unread" : undefined} tabIndex={-1}>
          <Tweet source={tweet} unread={unread} />
        </li>
      );
    });

    return (
      <div style={{overflowY: "auto", height: "100%"}} onScroll={onScroll}>
        <ul className="timeline">{elements}</ul>
      </div>
    );
  }
}
