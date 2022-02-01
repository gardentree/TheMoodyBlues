import * as React from "react";
import TweetBody from "../TweetBody";
import MediaBox from "../MediaBox";
import UserIdentifier from "../UserIdentifier";
import {openContextMenu} from "../../../helpers/tools";

interface Property {
  tweet: Twitter.Tweet;
}

const Quotation = (props: Property) => {
  const {tweet} = props;
  const media = tweet.extended_entities?.media;

  return (
    <div className="quote" onContextMenu={openContextMenu(tweet)} tabIndex={-1}>
      <div className="screen_name">
        <UserIdentifier identifier={tweet.user.screen_name} />
      </div>
      <p>
        <TweetBody tweet={tweet} />
      </p>
      {media && <MediaBox media={media} />}
    </div>
  );
};
export default Quotation;
