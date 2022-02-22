import * as React from "react";
import {useEffect} from "react";
import Article from "../Article";

export interface OwnProperty {
  identity: string;
}
export interface DispatchProperty {
  didMount(): void;
  willUnmount(): void;
}

type Property = OwnProperty & TMB.Screen & DispatchProperty;

const Timeline = (props: Property) => {
  const {identity, tweets, mode, lastReadID, didMount, willUnmount} = props;

  useEffect(() => {
    didMount();

    return () => {
      willUnmount();
    };
  }, []);

  return <Article identity={identity} tweets={tweets} mode={mode} lastReadID={lastReadID} />;
};
export default Timeline;
