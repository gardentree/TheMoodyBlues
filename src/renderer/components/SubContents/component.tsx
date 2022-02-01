import * as React from "react";
import * as ReactDOM from "react-dom";
import TweetList from "../TweetList";

interface Property {
  container: string;
  tweets?: Twitter.Tweet[] | null;
  onClose?(): any;
}

const SubContents = (props: Property) => {
  const {container, tweets, onClose} = props;

  if (!tweets) return null;

  const contents = ReactDOM.createPortal(
    <div className="SubContents">
      <div className="header">
        <button className="btn btn-default" onClick={onClose}>
          <span className="icon icon-cancel" />
        </button>
      </div>
      <TweetList identity="subcontents" tweets={tweets!} lastReadID={null} />
    </div>,
    document.querySelector(container)!
  );

  return contents;
};

export default SubContents;
