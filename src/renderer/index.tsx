import * as React from "react";
import * as ReactDOM from "react-dom";
import {CSSTransition,TransitionGroup} from "react-transition-group";
import * as FileSystem from "fs";
import './timeline.scss';

interface Property {
  tweets: Tweet[];
}
interface Tweet {
  id_str: string;
  full_text: string;
  user: User
  retweeted_status?: Tweet
}
interface User {
  id_str: string;
  profile_image_url: string;
  screen_name: string;
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
      if (!tweet_status['retweeted_status']) {
        tweet = tweet_status
        retweet = null
      }
      else {
        tweet = tweet_status.retweeted_status!
        retweet = tweet_status
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
                <img src={tweet.user.profile_image_url} className="tweeter" />
                {retweet && <img src={retweet.user.profile_image_url} className="retweeter" />}
              </div>
              <div>
                <div>@{tweet.user.screen_name}</div>
                <p>
                  {tweet.full_text}
                </p>
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
