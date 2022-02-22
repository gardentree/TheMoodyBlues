import * as React from "react";
import {useEffect} from "react";
import Article from "../Article";
import BranchBundle from "../BranchBundle";

export interface OwnProperty {
  identity: string;
}
export type StateProps = TMB.Screen & {
  branches: TMB.ScreenID[];
};
export interface DispatchProperty {
  didMount(): void;
  willUnmount(): void;
}

type Property = OwnProperty & StateProps & DispatchProperty;

const Timeline = (props: Property) => {
  const {identity, tweets, mode, lastReadID, branches, didMount, willUnmount} = props;

  useEffect(() => {
    didMount();

    return () => {
      willUnmount();
    };
  }, []);

  return (
    <React.Fragment>
      <Article identity={identity} tweets={tweets} mode={mode} lastReadID={lastReadID} />

      <BranchBundle root={identity} branches={branches} />
    </React.Fragment>
  );
};
export default Timeline;
