import * as React from "react";
import Tweet from "../Tweet";
import {TweetType} from "../../types/twitter";
import {CSSTransition, TransitionGroup} from "react-transition-group";

interface Property {
  tweets: TweetType[];
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
        <CSSTransition key={tweet.id_str} timeout={500} classNames="fade">
          <li data-id={tweet.id_str} className={unread ? "unread" : undefined} tabIndex={-1}>
            <Tweet source={tweet} unread={unread} />
          </li>
        </CSSTransition>
      );
    });

    return (
      <div className="TweetList" style={{overflowY: "auto", height: "100%"}} onScroll={onScroll}>
        <ol className="timeline">
          <TransitionGroup exit={false}>{elements}</TransitionGroup>
        </ol>
      </div>
    );
  }
}
