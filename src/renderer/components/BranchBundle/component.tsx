import React from "react";
import Branch from "../Branch";
import {TransitionGroup, CSSTransition} from "react-transition-group";

export interface OwnProps {
  root: TMB.ScreenID;
  branches: TMB.ScreenID[];
}

type Props = OwnProps;

const BranchBundle = (props: Props) => {
  const {root, branches} = props;

  return (
    <TransitionGroup>
      {branches.map((branch) => (
        <CSSTransition key={branch} timeout={300} classNames="fade">
          <Branch root={root} identifier={branch} />
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
};
export default BranchBundle;
