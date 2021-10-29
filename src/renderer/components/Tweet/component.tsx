import * as React from "react";
import UserIdentifier from "./UserIdentifier";
import TweetBody from "./TweetBody";
import MediaBox from "./MediaBox";
import * as DateUtility from "date-fns";

interface Property {
  source: Twitter.Tweet;
  unread: boolean;
}

const {TheMoodyBlues} = window;

export default class Tweet extends React.Component<Property, {}> {
  constructor(property: Property) {
    super(property);

    this.openContextMenu = this.openContextMenu.bind(this);
  }

  openContextMenu(event: React.SyntheticEvent<HTMLElement>) {
    // const url: string = event.currentTarget.dataset.url!;
    //
    const {source} = this.props;

    const keyword = (window.getSelection() || "").toString().trim();

    TheMoodyBlues.openTweetMenu({tweet: source, keyword: keyword});
  }

  render() {
    const {source, unread} = this.props;

    let tweet: Twitter.Tweet, retweet: Twitter.Tweet | null;
    if (source.retweeted_status === undefined) {
      tweet = source;
      retweet = null;
    } else {
      tweet = source.retweeted_status!;
      retweet = source;
    }

    let quote: Twitter.Tweet | null = null;
    if (tweet.quoted_status !== undefined) {
      quote = tweet.quoted_status;
    }
    let quoted_medias: Twitter.Media[] = [];
    if (quote && quote.extended_entities) {
      quoted_medias = quote.extended_entities.media;
    }

    let medias: Twitter.Media[] = [];
    if (tweet.extended_entities !== undefined) {
      medias = tweet.extended_entities.media;
    }

    return (
      <div data-url={`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`} onContextMenu={this.openContextMenu}>
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
