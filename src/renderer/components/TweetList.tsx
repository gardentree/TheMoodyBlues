import * as React from "react";
import {Tweet} from "./Tweet";
import * as twitter from "../others/twitter";

interface Property {
  tweets: twitter.Tweet[];
}

export class TweetList extends React.Component<Property, {latest: number}> {
  constructor(property: Property) {
    super(property);

    this.state = {latest: 0};

    this.scrolling = this.scrolling.bind(this);
  }

  scrolling(event: React.SyntheticEvent<HTMLElement>): void {
    if ((event.target as HTMLElement).scrollTop <= 0 && this.props.tweets.length > 0 && this.state.latest < this.props.tweets[0].id) {
      this.setState({latest: this.props.tweets[0].id});
    }
  }

  render() {
    const elements = this.props.tweets.map((tweet) => {
      const unread = this.state.latest > 0 && tweet.id > this.state.latest;
      return (
        <li key={tweet.id_str} data-id={tweet.id_str} className={unread ? "unread" : undefined} tabIndex={-1}>
          <Tweet source={tweet} unread={unread} />
        </li>
      );
    });

    return (
      <div style={{overflowY: "auto", height: "100%"}} onScroll={this.scrolling}>
        <ul className="timeline">{elements}</ul>
      </div>
    );
  }

  componentDidUpdate() {
    if (this.state.latest <= 0 && this.props.tweets.length > 0) {
      this.setState({latest: this.props.tweets[0].id});
    }
  }
}
