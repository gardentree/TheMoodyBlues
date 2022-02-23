import * as React from "react";
import TweetList from "../TweetList";
import MediaList from "../MediaList";

export interface OwnProps {
  identity: string;
  tweets: Twitter.Tweet[];
  mode: TMB.ArticleMode;
  lastReadID: string | null;
  children?: React.ReactNode;
}
export interface DispatchProps {
  onScroll(event: React.SyntheticEvent<HTMLElement>): void;
  onChangeMode(event: React.SyntheticEvent<HTMLElement>): void;
}

type Props = OwnProps & DispatchProps;

const Article = (props: Props) => {
  const {identity, tweets, mode, lastReadID, onScroll, onChangeMode, children} = props;

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

  return (
    <div className="Article" onScroll={onScroll}>
      <header className="toolbar toolbar-header">
        <div className="actions">
          <div className="actions-center">{children}</div>
          <div className="actions-right">
            <button onClick={onChangeMode} className="btn btn-default btn-dropdown">
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
