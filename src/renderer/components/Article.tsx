import {useSelector, useDispatch} from "react-redux";
import TweetList from "./TweetList";
import MediaList from "./MediaList";
import adapters from "@libraries/adapter";
import * as actions from "@actions";
import {css} from "@emotion/react";

interface OwnProps {
  identifier: TMB.ScreenID;
  children?: React.ReactNode;
}
type StateProps = TMB.Screen;

const {facade} = window;

const Article = (props: OwnProps) => {
  const {identifier, children} = props;

  const {tweets, mode, lastReadID} = useSelector<TMB.State, StateProps>((state) => {
    const {screens} = state;
    const screen = adapters.screens.getSelectors().selectById(screens, identifier)!;

    return {
      ...screen,
    };
  });

  const dispatch = useDispatch();
  function onMark(latest: Twitter.TweetID) {
    dispatch(actions.mark({identifier, lastReadID: latest}));
  }
  function onShowModeMenu(mode: TMB.ArticleMode) {
    facade.actions.showModeMenu(identifier, mode);
  }

  const article = (() => {
    switch (mode) {
      case "tweet":
        return <TweetList identifier={identifier} tweets={tweets} lastReadID={lastReadID} />;
      case "media":
        return <MediaList identifier={identifier} tweets={tweets} />;
      default:
        throw new Error(mode);
    }
  })();

  const onScroll = (event: React.SyntheticEvent<HTMLElement>) => {
    const latest = tweets[0].id_str;
    if ((event.target as HTMLElement).scrollTop <= 0 && tweets.length > 0 && lastReadID < latest) {
      onMark(latest);
    }
  };
  const onClickModeMenu = (event: React.SyntheticEvent<HTMLElement>) => {
    onShowModeMenu(mode);
  };

  return (
    <div css={styles} className="theme" onScroll={onScroll}>
      <header className="toolbar toolbar-header">
        <div className="actions">
          <div className="actions-center">{children}</div>
          <div className="actions-right">
            <button onClick={onClickModeMenu} className="btn btn-default btn-dropdown">
              <span className="icon icon-list"></span>
            </button>
          </div>
        </div>
      </header>
      {article}
    </div>
  );
};
export default Article;

const styles = css`
  overflow-y: auto;
  height: 100%;

  header {
    .actions {
      display: flex;
      padding: 4px 4px 3px 4px;

      & > * {
        margin: 0 4px;
      }

      .actions-center {
        flex: auto;
      }
      .actions-right {
        flex: initial;
      }
    }
  }
`;
