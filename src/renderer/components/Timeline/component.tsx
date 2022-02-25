import * as React from "react";
import {useEffect} from "react";
import Article from "../Article";
import BranchBundle from "../BranchBundle";

export interface OwnProps {
  identity: string;
}
export interface StateProps {
  branches: TMB.ScreenID[];
}
export interface DispatchProps {
  didMount(): void;
  willUnmount(): void;
}

type Props = OwnProps & StateProps & DispatchProps;

const Timeline = (props: Props) => {
  const {identity, branches, didMount, willUnmount} = props;

  useEffect(() => {
    didMount();

    return () => {
      willUnmount();
    };
  }, []);

  return (
    <React.Fragment>
      <Article identity={identity} />

      <BranchBundle root={identity} branches={branches} />
    </React.Fragment>
  );
};
export default Timeline;
