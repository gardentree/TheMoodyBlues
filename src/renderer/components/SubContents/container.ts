import {connect} from "react-redux";
import Component from "./component";
import * as actions from "@actions";

const mapStateToProps = (state: TMB.State) => {
  const {subcontents} = state;

  return {
    tweets: subcontents.tweets,
  };
};
const mapDispatchToProps = {
  onClose: () => actions.updateTweetsInSubContents([]),
};
export default connect(mapStateToProps, mapDispatchToProps)(Component);
