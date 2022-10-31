import {css} from "@emotion/react";
import MediaBox from "./Tweet/MediaBox";

interface OwnProps {
  identifier: TMB.ScreenID;
  tweets: Twitter.Tweet[];
}

const MediaList = (props: OwnProps) => {
  const {tweets} = props;
  const media = unique(
    tweets
      .filter((tweet) => tweet.extended_entities?.media)
      .map((tweet) => tweet.extended_entities!.media)
      .flat()
  );

  return (
    <div css={styles}>
      <MediaBox media={media} />
    </div>
  );
};
export default MediaList;

function unique(media: Twitter.Media[]) {
  return Array.from(new Map(media.map((media) => [media.id_str, media])).values());
}

const styles = css({
  img: {
    maxWidth: "100%",
    maxHeight: "calc(100vh - 60px)",
  },
});
