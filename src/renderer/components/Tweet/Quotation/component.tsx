import * as React from "react";
import TweetBody from "../TweetBody";
import MediaBox from "../MediaBox";
import UserIdentifier from "../UserIdentifier";

interface Property {
  tweet: Twitter.Tweet;
}

export default class Quotation extends React.Component<Property, {}> {
  constructor(props: Property) {
    super(props);
  }

  render() {
    const {tweet} = this.props;
    const media = tweet.extended_entities?.media;

    return (
      <div className="quote">
        <div className="screen_name">
          <UserIdentifier identifier={tweet.user.screen_name} />
        </div>
        <p>
          <TweetBody tweet={tweet} />
        </p>
        {media && <MediaBox media={media} />}
      </div>
    );
  }
}
