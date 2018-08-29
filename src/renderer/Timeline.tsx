import * as React from "react";
import {CSSTransition,TransitionGroup} from "react-transition-group";
import './timeline.scss';
import {PrettyTweet} from "./PrettyTweet";
import {Tweet} from "./twitter";
import {openLinkOnAnchor} from "./tools"

interface Property {
  tweets: Tweet[];
}

export class Timeline extends React.Component<Property,Property> {
  constructor(property: Property) {
    super(property);

    this.state = {tweets: property.tweets};
  }
  render() {
    const items = this.state.tweets.map((tweet_status) => {
      let tweet: Tweet,retweet: Tweet|null;
      if (tweet_status.retweeted_status === undefined) {
        tweet = tweet_status
        retweet = null
      }
      else {
        tweet = tweet_status.retweeted_status!
        retweet = tweet_status
      }

      let quote: Tweet|null = null;
      if (tweet.quoted_status !== undefined) {
        quote = tweet.quoted_status
      }

      let medias: any|null = null;
      if (tweet.extended_entities !== undefined) {
        medias = tweet.extended_entities.media.map((media) => {
          return (
            <a key={media.id_str} href={media.media_url_https} onClick={openLinkOnAnchor}>
              <img src={media.media_url_https} className="photo" />
            </a>
          )
        })
      }

      return (
        <CSSTransition
          key={tweet_status.id_str}
          classNames="fade"
          timeout={300}
        >
          <li key={tweet_status.id_str}>
            <div>
              <div className="avatar">
                <img src={tweet.user.profile_image_url_https} className="tweeter" />
                {retweet && <img src={retweet.user.profile_image_url_https} className="retweeter" />}
              </div>
              <div className='tweet'>
                <div>
                  <div>@{tweet.user.screen_name}</div>
                  <p><PrettyTweet tweet={tweet} /></p>
                  {medias && <div>{medias}</div>}
                </div>
                {quote && <div className="quote"><div>@{quote.user.screen_name}</div><p><PrettyTweet tweet={quote} /></p></div>}
                {retweet && <div>{retweet.user.screen_name} retweeted</div>}
              </div>
            </div>
          </li>
        </CSSTransition>
      )
    });

    return (
      <div>
        <ul className="timeline">
          <TransitionGroup>
            { items }
          </TransitionGroup>
        </ul>
      </div>
    );
  }
}
