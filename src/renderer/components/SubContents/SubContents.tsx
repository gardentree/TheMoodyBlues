import * as React from "react";
import * as ReactDOM from "react-dom";
import {TweetList} from "../TweetList";
import * as twitter from "../../others/twitter";

interface Property {
  container: string;
  tweets?: twitter.Tweet[] | null;
  onClose?(): any;
}

const SubContents: React.SFC<Property> = ({container, tweets, onClose}) => {
  const display = tweets ? "block" : "none";

  if (!tweets) return null;

  const contents = ReactDOM.createPortal(
    <div className="subcontent" style={{display: display}}>
      <div className="header">
        <button className="btn btn-default" onClick={onClose}>
          <span className="icon icon-cancel" />
        </button>
      </div>
      <TweetList tweets={tweets!} />
    </div>,
    document.querySelector(container)!
  );

  return <React.Fragment>{contents}</React.Fragment>;
};

export default SubContents;
