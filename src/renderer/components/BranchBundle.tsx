import Branch from "./Branch";
import {TransitionGroup, CSSTransition} from "react-transition-group";

interface OwnProps {
  root: TMB.ScreenID;
  branches: TMB.ScreenID[];
}

const BranchBundle = (props: OwnProps) => {
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
