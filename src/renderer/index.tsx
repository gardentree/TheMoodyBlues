import * as React from "react";
import * as ReactDOM from "react-dom";
import {CSSTransition,TransitionGroup} from "react-transition-group";
import * as FileSystem from "fs";
import './timeline.scss';
import {shell} from "electron"

interface Property {
  tweets: Tweet[];
}
interface Tweet {
  id_str: string;
  full_text: string;
  user: User;
  retweeted_status?: Tweet;
  quoted_status?: Tweet;
  extended_entities?: {
    media: Media[]
  };
  display_text_range: number[];
  entities: {
    urls: {
      url: string;
      expanded_url: string;
      display_url: string;
    }[];
  };
}
interface User {
  id_str: string;
  profile_image_url_https: string;
  screen_name: string;
}
interface Media {
  id_str: string;
  media_url_https: string;
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
                {quote && <div className="quote">{quote.full_text}</div>}
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
class PrettyTweet extends React.Component<{tweet: Tweet},{tweet: Tweet}> {
  constructor(props: {tweet: Tweet}) {
    super(props);
    this.state = {tweet: props.tweet};

    this.openLink = this.openLink.bind(this);
  }
  render() {
    const tweet = this.state.tweet

    let text = tweet.full_text.slice(tweet.display_text_range[0],tweet.display_text_range[1])
    let fragments: JSX.Element[] = []
    for (let property of tweet.entities.urls) {
      const elements = text.split(property.url)
      fragments.push(React.createElement(React.Fragment,{key: fragments.length},this.breakLine(elements[0])))
      fragments.push(React.createElement("a",{key: fragments.length,href: property.expanded_url,onClick: this.openLink},property.display_url))

      text = elements[1]
    }
    if (text !== undefined) {
      fragments.push(React.createElement(React.Fragment,{key: fragments.length},this.breakLine(text)))
    }

    return (
      <React.Fragment>{fragments}</React.Fragment>
    )
  }
  private openLink(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    shell.openExternal(event.currentTarget.href);
  }
  private breakLine(text: string) {
    const elements = text.split(/(?:\r\n|\r|\n)/)

    return (
      elements.map((element,index) => {
        if (elements.length > (index + 1)) {
          return (<React.Fragment key={index}>{element}<br/></React.Fragment>)
        }
        else {
          return (<React.Fragment key={index}>{element}</React.Fragment>)
        }
      })
    )
  }
}

let tweets = JSON.parse(FileSystem.readFileSync('tweets.json').toString());

ReactDOM.render(
  <Timeline tweets={tweets} />,
  document.getElementById("app")
);
