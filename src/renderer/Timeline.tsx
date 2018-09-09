import * as React from "react";
import {TweetList} from "./TweetList";
import * as twitter from "./twitter";
import {decodeHTML} from "./tools";

interface Property {
  twitter: any;
}

const storage = require("electron-json-storage");
export class Timeline extends React.Component<Property,{tweets: twitter.Tweet[]}> {
  private timer: any|null;

  constructor(property: Property) {
    super(property);

    this.state = {tweets: []};

    this.timer = null
  }

  componentDidMount() {
    storage.get('tweets',(error: string,tweets: twitter.Tweet[]) => {
      if (error) {
        console.log(error);
      }
      if (!Array.isArray(tweets)) {
        tweets = []
      }

      this.setState({tweets: tweets});

      this.timer = setTimeout(() => {
        this.reorder();
      },120 * 1000);
    });
  }

  render() {
    return (<TweetList tweets={this.state.tweets} />)
  }

  public reload() {
    this.reorder();
  }
  private reorder() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    let option = {
      count: 200,
      include_entities: true,
      tweet_mode: 'extended'
    }
    if (this.state.tweets.length > 0) {
      option['since_id'] = this.state.tweets[0].id_str
    }

    this.props.twitter.get('statuses/home_timeline',option,(error: string,tweets: twitter.Tweet[],response: any) => {
      if (error) throw error;

      if (tweets.length > 0) {
        var growly = require('growly');
        for (let tweet of tweets.slice(0,20)) {
          growly.notify(decodeHTML(tweet.full_text),{
            title: tweet.user.screen_name,
            icon: tweet.user.profile_image_url_https,
          });
        }

        const all = tweets.concat(this.state.tweets).slice(0,400);
        this.setState({tweets: all});

        storage.set('tweets',all,(error: string) => {
          if (error) throw error;
        })
      }

      this.timer = setTimeout(() => {
        this.reorder();
      },120 * 1000);
    })
  }
}
