import {remote, shell} from "electron";
import * as React from "react";
import UserIdentifier from "./UserIdentifier";
import TweetBody from "./TweetBody";
import MediaBox from "./MediaBox";
import * as DateUtility from "date-fns";
import {TweetType, MediaType} from "../../types/twitter";

interface Property {
  source: TweetType;
  unread: boolean;
  search: any;
  converse: any;
}

export default class Tweet extends React.Component<Property, {}> {
  constructor(property: Property) {
    super(property);

    this.openContextMenu = this.openContextMenu.bind(this);
  }

  openContextMenu(event: React.SyntheticEvent<HTMLElement>) {
    const url: string = event.currentTarget.dataset.url!;

    const {search, source, converse} = this.props;

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

    menu.append(
      new MenuItem({
        label: "会話を表示",
        click() {
          converse(source.retweeted_status === undefined ? source : source.retweeted_status!);
        },
      })
    );

    const keyword = (window.getSelection() || "").toString().trim();
    if (keyword.length > 0) {
      menu.append(
        new MenuItem({
          label: `"${keyword}"を検索`,
          click() {
            search(keyword);
          },
        })
      );
    }

    if (process.env.NODE_ENV === "development") {
      menu.append(new MenuItem({type: "separator"}));

      menu.append(
        new MenuItem({
          label: "JSON形式でコピー",
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
    const {source, unread} = this.props;

    let tweet: TweetType, retweet: TweetType | null;
    if (source.retweeted_status === undefined) {
      tweet = source;
      retweet = null;
    } else {
      tweet = source.retweeted_status!;
      retweet = source;
    }

    let quote: TweetType | null = null;
    if (tweet.quoted_status !== undefined) {
      quote = tweet.quoted_status;
    }
    let quoted_medias: MediaType[] = [];
    if (quote && quote.extended_entities) {
      quoted_medias = quote.extended_entities.media;
    }

    let medias: MediaType[] = [];
    if (tweet.extended_entities !== undefined) {
      medias = tweet.extended_entities.media;
    }

    return (
      <div data-url={`https://twitter.com/${source.user.screen_name}/status/${source.id_str}`} onContextMenu={this.openContextMenu}>
        <div className={`avatar${retweet ? " retweet" : ""}${unread ? " unread" : ""}`}>
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
              <TweetBody tweet={tweet} expand={true} />
            </p>
            {medias && <MediaBox medias={medias} />}
          </div>
          {quote && (
            <div className="quote">
              <div className="screen_name">
                <UserIdentifier identifier={quote.user.screen_name} />
              </div>
              <p>
                <TweetBody tweet={quote} />
              </p>
              {quoted_medias && <MediaBox medias={quoted_medias} />}
            </div>
          )}
          {retweet && <div className="retweeter">Retweeted by {retweet.user.screen_name}</div>}
        </div>
      </div>
    );
  }

  static prettyTime(source: string): string {
    const date = DateUtility.parse(source, "E MMM d H:m:s x yyyy", new Date());
    const now = new Date();

    let format;
    if (DateUtility.format(now, "yyyy-MM-dd") == DateUtility.format(date, "yyyy-MM-dd")) {
      format = "HH:mm:ss";
    } else {
      format = "yyyy-MM-dd HH:mm:ss";
    }

    return DateUtility.format(date, format);
  }
}
