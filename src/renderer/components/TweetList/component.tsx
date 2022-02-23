import * as React from "react";
import Tweet from "../Tweet";
import {default as TweetErrorBoundary} from "../Tweet/ErrorBoundary";
import {CSSTransition, TransitionGroup} from "react-transition-group";

export interface OwnProps {
  identity: TMB.ScreenID;
  tweets: Twitter.Tweet[];
  lastReadID: string | null;
}
export interface StateProps {}
type Props = OwnProps & StateProps;

const TweetList = (props: Props) => {
  const {tweets, lastReadID} = props;
  const elements = tweets.map((tweet) => {
    const unread = lastReadID != null && tweet.id_str > lastReadID;
    return (
      <CSSTransition key={tweet.id_str} timeout={500} classNames="fade">
        <li data-id={tweet.id_str} className={unread ? "unread" : undefined}>
          <TweetErrorBoundary tweet={tweet}>
            <Tweet source={tweet} unread={unread} />
          </TweetErrorBoundary>
        </li>
      </CSSTransition>
    );
  });

  return (
    <div className="TweetList">
      <ol className="tweets">
        <TransitionGroup exit={false}>{elements}</TransitionGroup>
      </ol>
    </div>
  );
};
export default TweetList;
