import * as React from "react";
import * as ReactDOM from "react-dom";
import TweetList from "../TweetList";

interface Property {
  container: string;
  tweets: Twitter.Tweet[];
  onClose(): void;
}

const Branch = (props: Property) => {
  const {container, tweets, onClose} = props;

  if (tweets.length <= 0) return null;

  const contents = ReactDOM.createPortal(
    <div className="Branch">
      <div className="header">
        <button className="btn btn-default" onClick={onClose}>
          <span className="icon icon-cancel" />
        </button>
      </div>
      <TweetList identity="subcontents" tweets={tweets} lastReadID={null} />
    </div>,
    document.querySelector(container)!
  );

  return contents;
};

export default Branch;
