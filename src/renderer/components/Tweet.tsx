import {useMemo} from "react";
import UserIdentifier from "./Tweet/UserIdentifier";
import TweetBody from "./Tweet/TweetBody";
import MediaBox from "./Tweet/MediaBox";
import Quotation from "./Tweet/Quotation";
import * as DateUtility from "date-fns";
import {showMenuForTweet} from "@libraries/tools";

interface OwnProps {
  source: Twitter.Tweet;
  unread: boolean;
}

const Tweet = (props: OwnProps) => {
  const {source, unread} = props;

  const memo = useMemo(() => {
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

    let media: Twitter.Media[] = [];
    if (tweet.extended_entities !== undefined) {
      media = tweet.extended_entities.media;
    }

    return (
      <div data-url={`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`} onContextMenu={showMenuForTweet(source)} tabIndex={-1}>
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
              <div className="created_at">{prettyTime(tweet.created_at)}</div>
            </div>
            <p>
              <TweetBody tweet={tweet} expand={true} />
            </p>
            {media && <MediaBox media={media} />}
          </div>
          {quote && <Quotation tweet={quote} />}
          {retweet && <div className="retweeter">Retweeted by {retweet.user.screen_name}</div>}
        </div>
      </div>
    );
  }, [source.id_str, unread]);

  return memo;
};
export default Tweet;

function prettyTime(source: string): string {
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
