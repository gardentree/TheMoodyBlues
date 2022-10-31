import React, {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import Article from "./Article";
import BranchBundle from "./BranchBundle";
import * as actions from "@actions";
import adapters from "@libraries/adapter";

interface OwnProps {
  identifier: TMB.ScreenID;
}
interface StateProps {
  branches: TMB.ScreenID[];
}

const Timeline = (props: OwnProps) => {
  const {identifier} = props;
  const {branches} = useSelector<TMB.State, StateProps>((state) => {
    const {lineage} = state;
    const branches = adapters.lineage.getSelectors().selectById(lineage, identifier)?.branches || [];

    return {
      branches,
    };
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.mountScreen(identifier));

    return () => {
      dispatch(actions.unmountScreen(identifier));
    };
  }, []);

  return (
    <React.Fragment>
      <Article identifier={identifier} />

      <BranchBundle root={identifier} branches={branches} />
    </React.Fragment>
  );
};
export default Timeline;
