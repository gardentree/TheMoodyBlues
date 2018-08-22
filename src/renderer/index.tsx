import * as React from "react";
import * as ReactDOM from "react-dom";
import {CSSTransition,TransitionGroup} from "react-transition-group";
import * as FileSystem from "fs";
import './timeline.scss';
import {PrettyTweet} from "./PrettyTweet";
import {Tweet} from "./twitter";

interface Property {
  tweets: Tweet[];
}

class Timeline extends React.Component<Property,Property> {
  constructor(props: Property) {
    super(props);
    this.state = {tweets: props.tweets};

    this.tweetDummy = this.tweetDummy.bind(this);
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
            <img key={media.id_str} src={media.media_url_https} className="photo" />
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
              <div>
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
        <button type="button" onClick={this.tweetDummy}>Tweet</button>
        <ul className="timeline">
          <TransitionGroup>
            { items }
          </TransitionGroup>
        </ul>
      </div>
    );
  }
  private tweetDummy(event: React.SyntheticEvent): void {
    const index = Math.floor(Math.random() * Math.floor(this.state.tweets.length));
    const tweet = Object.assign({},this.state.tweets[index]);
    tweet.id_str = new Date().getTime().toString();

    this.addTweet(tweet)
  }
  public addTweet(tweet: Tweet): void {
    this.state.tweets.unshift(tweet)
    this.setState({tweets: this.state.tweets})
  }
}

let tweets = JSON.parse(FileSystem.readFileSync('tweets.json').toString());

ReactDOM.render(
  <Timeline tweets={tweets} />,
  document.getElementById("app")
);
