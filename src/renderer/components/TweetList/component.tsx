import * as React from "react";
import Tweet from "../Tweet";
import {default as TweetErrorBoundary} from "../Tweet/ErrorBoundary";
import {CSSTransition, TransitionGroup} from "react-transition-group";

export interface OwnProperty {
  identity: TheMoodyBlues.Store.TimelineIdentity;
  tweets: Twitter.Tweet[];
  lastReadID: string | null;
}
export interface StateProperty {}
export interface DispatchProperty {
  onScroll: any;
}
type Property = OwnProperty & StateProperty & DispatchProperty;

export default class TweetList extends React.Component<Property, {}> {
  constructor(property: Property) {
    super(property);
  }

  render() {
    const {tweets, lastReadID, onScroll} = this.props;
    const elements = tweets.map((tweet) => {
      const unread = lastReadID != null && tweet.id_str > lastReadID;
      return (
        <CSSTransition key={tweet.id_str} timeout={500} classNames="fade">
          <li data-id={tweet.id_str} className={unread ? "unread" : undefined} tabIndex={-1}>
            <TweetErrorBoundary tweet={tweet}>
              <Tweet source={tweet} unread={unread} />
            </TweetErrorBoundary>
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
