import * as React from "react";
import MediaBox from "../Tweet/MediaBox";

export interface OwnProperty {
  identity: TheMoodyBlues.TimelineIdentity;
  tweets: Twitter.Tweet[];
}
type Property = OwnProperty;

const MediaList = (props: Property) => {
  const {tweets} = props;
  const media = tweets
    .filter((tweet) => tweet.extended_entities?.media)
    .map((tweet) => tweet.extended_entities!.media)
    .flat();

  return (
    <div className="MediaList">
      <MediaBox media={media} />
    </div>
  );
};
export default MediaList;
