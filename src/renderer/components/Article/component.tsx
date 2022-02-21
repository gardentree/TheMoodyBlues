import * as React from "react";
import TweetList from "../TweetList";
import MediaList from "../MediaList";

export interface OwnProperty {
  identity: string;
  tweets: Twitter.Tweet[];
  mode: TMB.ArticleMode;
  lastReadID: string | null;
  children?: React.ReactNode;
}
export interface DispatchProperty {
  onScroll(event: React.SyntheticEvent<HTMLElement>): void;
  onChangeMode(event: React.SyntheticEvent<HTMLElement>): void;
}

type Property = OwnProperty & DispatchProperty;

const Article = (props: Property) => {
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
