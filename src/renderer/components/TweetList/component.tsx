import React from "react";
import Tweet from "../Tweet";
import {ErrorBoundary} from "react-error-boundary";
import {CSSTransition, TransitionGroup} from "react-transition-group";

export interface OwnProps {
  identity: TMB.ScreenID;
  tweets: Twitter.Tweet[];
  lastReadID: string | null;
}
type Props = OwnProps;

const {facade} = window;

const TweetList = (props: Props) => {
  const {tweets, lastReadID} = props;

  const elements = tweets.map((tweet) => {
    const unread = lastReadID != null && tweet.id_str > lastReadID;

    const errorHandler = (error: Error, information: {componentStack: string}) => {
      facade.logger.error(error.stack);
      facade.logger.error(tweet);
    };

    return (
      <CSSTransition key={tweet.id_str} timeout={500} classNames="fade">
        <li data-id={tweet.id_str} className={unread ? "unread" : undefined}>
          <ErrorBoundary
            onError={errorHandler}
            fallbackRender={({error, resetErrorBoundary}) => (
              <div>
                {tweet.id_str}: {error.message}
              </div>
            )}
          >
            <Tweet source={tweet} unread={unread} />
          </ErrorBoundary>
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
