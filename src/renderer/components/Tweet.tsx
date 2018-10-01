import {remote, shell} from "electron";
import * as React from "react";
import UserIdentifier from "./UserIdentifier";
import PrettyTweet from "./PrettyTweet";
import {MediaBox} from "./MediaBox";
import * as DateUtility from "date-fns";
import * as twitter from "../others/twitter";

interface Property {
  source: twitter.Tweet;
  unread: boolean;
}

export class Tweet extends React.Component<Property, {}> {
  constructor(property: Property) {
    super(property);

    this.openContextMenu = this.openContextMenu.bind(this);
  }

  openContextMenu(event: React.SyntheticEvent<HTMLElement>) {
    const url: string = event.currentTarget.dataset.url!;

    const {Menu, MenuItem} = remote;
    const menu = new Menu();
    menu.append(
      new MenuItem({
        label: "ブラウザで開く",
        click() {
          shell.openExternal(url);
        },
      })
    );

    if (process.env.NODE_ENV === "development") {
      menu.append(new MenuItem({type: "separator"}));

      const source = this.props.source;
      menu.append(
        new MenuItem({
          label: "JSONをコピー",
          click() {
            const {clipboard} = require("electron");
            clipboard.writeText(JSON.stringify(source, null, "  "));
          },
        })
      );
    }

    menu.popup({});
  }

  render() {
    let tweet: twitter.Tweet, retweet: twitter.Tweet | null;
    if (this.props.source.retweeted_status === undefined) {
      tweet = this.props.source;
      retweet = null;
    } else {
      tweet = this.props.source.retweeted_status!;
      retweet = this.props.source;
    }

    let quote: twitter.Tweet | null = null;
    if (tweet.quoted_status !== undefined) {
      quote = tweet.quoted_status;
    }

    let medias: twitter.Media[] = [];
    if (tweet.extended_entities !== undefined) {
      medias = tweet.extended_entities.media;
    }

    return (
      <div data-url={`https://twitter.com/${this.props.source.user.screen_name}/status/${this.props.source.id_str}`} onContextMenu={this.openContextMenu}>
        <div className={`avatar${retweet ? " retweet" : ""}${this.props.unread ? " unread" : ""}`}>
          <img src={tweet.user.profile_image_url_https} className="tweeter" />
          {retweet && <img src={retweet.user.profile_image_url_https} className="retweeter" />}
        </div>
        <div className="tweet">
          <div>
            <div className="meta">
              <div className="screen_name">
                <UserIdentifier identifier={tweet.user.screen_name} />
              </div>
              <div className="created_at">{Tweet.prettyTime(tweet.created_at)}</div>
            </div>
            <p>
              <PrettyTweet tweet={tweet} />
            </p>
            {medias && <MediaBox medias={medias} />}
          </div>
          {quote && (
            <div className="quote">
              <div className="screen_name">
                <UserIdentifier identifier={quote.user.screen_name} />
              </div>
              <p>
                <PrettyTweet tweet={quote} />
              </p>
            </div>
          )}
          {retweet && <div className="retweeter">Retweeted by {retweet.user.screen_name}</div>}
        </div>
      </div>
    );
  }

  static prettyTime(source: string): string {
    const date = DateUtility.parse(source);
    const now = new Date();

    let format;
    if (DateUtility.format(now, "YYYY-MM-DD") == DateUtility.format(date, "YYYY-MM-DD")) {
      format = "HH:mm:ss";
    } else {
      format = "YYYY-MM-DD HH:mm:ss";
    }

    return DateUtility.format(date, format);
  }
}
