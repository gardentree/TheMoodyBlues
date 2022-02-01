import * as React from "react";
import {useEffect} from "react";
import TweetList from "../TweetList";

export interface OwnProperty {
  identity: string;
}
export interface StateProperty {
  tweets: Twitter.Tweet[];
  lastReadID: string;
}
export interface DispatchProperty {
  didMount: any;
  willUnmount(): void;
}

type Property = OwnProperty & StateProperty & DispatchProperty;

const Timeline = (props: Property) => {
  const {identity, tweets, lastReadID, didMount, willUnmount} = props;

  useEffect(() => {
    didMount();

    return () => {
      willUnmount();
    };
  }, []);

  return <TweetList identity={identity} tweets={tweets} lastReadID={lastReadID} />;
};
export default Timeline;
