import * as React from "react";
import TweetList from "../TweetList";
import MediaList from "../MediaList";

export interface OwnProps {
  identity: string;
  children?: React.ReactNode;
}
export type StateProps = TMB.Screen;
export interface DispatchProps {
  onMark(latest: Twitter.TweetID): void;
  onShowModeMenu(mode: TMB.ArticleMode): void;
}

type Props = OwnProps & StateProps & DispatchProps;

const Article = (props: Props) => {
  const {identity, tweets, mode, lastReadID, onMark, onShowModeMenu, children} = props;

  const article = (() => {
    switch (mode) {
      case "tweet":
        return <TweetList identity={identity} tweets={tweets} lastReadID={lastReadID} />;
      case "media":
        return <MediaList identity={identity} tweets={tweets} />;
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
    <div className="Article" onScroll={onScroll}>
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
