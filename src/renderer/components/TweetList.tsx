import {css} from "@emotion/react";
import Tweet from "./Tweet";
import {ErrorBoundary} from "react-error-boundary";
import {CSSTransition, TransitionGroup} from "react-transition-group";

export interface OwnProps {
  identifier: TMB.ScreenID;
  tweets: Twitter.Tweet[];
  lastReadID: string | null;
}

const {facade} = window;

const TweetList = (props: OwnProps) => {
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
    <div css={styles}>
      <ol className="tweets">
        <TransitionGroup exit={false}>{elements}</TransitionGroup>
      </ol>
    </div>
  );
};
export default TweetList;

const styles = css`
  ol.tweets {
    line-height: normal;
    list-style: none;
    margin: 0;
    padding-left: 0;

    li {
      border-bottom: solid 1px var(--line-color);

      *:focus {
        outline: none;
        color: white;
        background-color: var(--focus-color);

        .tweet {
          p {
            span.hashtag {
              text-decoration: underline;
            }
            span.mention {
              text-decoration: underline;
            }
            a {
              text-decoration: underline;
            }
          }
          *::selection {
            background: white;
          }
        }
      }

      & > div {
        display: table;
        table-layout: fixed;
        border-collapse: separate;
        border-spacing: 8px;
      }
      & > div > div {
        display: table-cell;
        vertical-align: top;
      }
      .tweet {
        width: 100%;

        * {
          user-select: text;
        }

        .meta {
          display: table;
          border-collapse: collapse;
          width: 100%;
          font-size: 90%;

          & > div {
            display: table-cell;
          }
          .screen_name {
            font-weight: bold;
          }
          .created_at {
            text-align: right;
          }
        }
        p {
          margin: 0;
          word-break: break-all;

          br + br {
            display: none;
          }

          span.hashtag {
            cursor: pointer;
          }
          span.mention {
            cursor: pointer;
          }
          a {
            color: inherit;
            text-decoration: none;
          }
        }
        .media {
          margin-top: 8px;
          display: inline-block;
        }
        .retweeter {
          margin-top: 8px;
          font-size: 90%;
        }
      }

      .avatar {
        position: relative;

        img {
          border-radius: 4px;
        }

        img.tweeter {
          display: block;
          width: 48px;
        }

        &.retweet {
          img.tweeter {
            width: 36px;
            margin-right: 12px;
          }
          img.retweeter {
            position: absolute;
            width: 24px;
            display: block;
            right: 0;
            top: 24px;
          }
        }

        &.unread:after {
          font-family: "photon-entypo";
          position: absolute;
          font-size: 14px;
          content: "\ue8ae";
          color: #4372e0;
          right: 2px;
          top: 30px;
        }
      }
      .quote {
        border: solid 1px var(--line-color);
        margin-top: 8px;
        padding: 4px;

        .screen_name {
          font-size: 90%;
        }
      }
    }
    img.photo {
      height: 48px;
      width: 48px;
      object-fit: cover;
      vertical-align: bottom;

      & + img.photo {
        margin-left: 8px;
      }
    }
  }

  .fade-enter {
    opacity: 0;
  }
  .fade-enter-done {
    opacity: 1;
  }
`;
