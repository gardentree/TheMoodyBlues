import {useSelector} from "react-redux";
import adapters from "@libraries/adapter";
import {css} from "@emotion/react";

interface OwnProps {
  identifier: TMB.ScreenID;
}
interface StateProps {
  title: string;
  unread: number;
}

const TabItem = (props: OwnProps) => {
  const {identifier} = props;
  const {title, unread} = useSelector<TMB.State, StateProps>((state) => {
    const {screens, backstages} = state;
    const screen = adapters.screens.getSelectors().selectById(screens, identifier)!;
    const preference = adapters.backstages.getSelectors().selectById(backstages, identifier)!;

    const {tweets, lastReadID} = screen;
    const unread = tweets ? tweets.filter((tweet: Twitter.Tweet) => tweet.id_str > lastReadID).length : 0;

    return {
      title: preference.title,
      unread,
    };
  });

  return (
    <div className="TabItem">
      {title}
      {unread > 0 && <span css={styles}>{unread}</span>}
    </div>
  );
};
export default TabItem;

const styles = css({
  position: "absolute",
  display: "inline-block",
  right: "10px",
  color: "white",
  backgroundColor: "#969696",
  padding: "0 10px",
  borderRadius: "8px",
});
