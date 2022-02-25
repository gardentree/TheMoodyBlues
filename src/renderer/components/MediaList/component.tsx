import React from "react";
import MediaBox from "../Tweet/MediaBox";

export interface OwnProps {
  identity: TMB.ScreenID;
  tweets: Twitter.Tweet[];
}
type Props = OwnProps;

const MediaList = (props: Props) => {
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
