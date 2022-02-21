import {connect} from "react-redux";
import Component from "./component";
import {updateTweetsInSubContents} from "@modules/subcontents";

const mapStateToProps = (state: TMB.State) => {
  const {subcontents} = state;

  return {
    tweets: subcontents.tweets,
  };
};
const mapDispatchToProps = {
  onClose: () => updateTweetsInSubContents([]),
};
export default connect(mapStateToProps, mapDispatchToProps)(Component);
