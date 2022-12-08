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
    <div css={container}>
      <span>{title}</span>
      {unread > 0 && <span css={badge}>{unread}</span>}
    </div>
  );
};
export default TabItem;

const container = css`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  line-height: 1;
  padding: 2px 0;
`;
const badge = css`
  position: absolute;
  right: 10px;
  color: white;
  background-color: #969696;
  padding: 2px 10px;
  border-radius: 8px;
`;
