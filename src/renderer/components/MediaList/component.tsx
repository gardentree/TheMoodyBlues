import React from "react";
import MediaBox from "../Tweet/MediaBox";

export interface OwnProps {
  identifier: TMB.ScreenID;
  tweets: Twitter.Tweet[];
}
type Props = OwnProps;

const MediaList = (props: Props) => {
  const {tweets} = props;
  const media = unique(
    tweets
      .filter((tweet) => tweet.extended_entities?.media)
      .map((tweet) => tweet.extended_entities!.media)
      .flat()
  );

  return (
    <div className="MediaList">
      <MediaBox media={media} />
    </div>
  );
};
export default MediaList;

function unique(media: Twitter.Media[]) {
  return Array.from(new Map(media.map((media) => [media.id_str, media])).values());
}
