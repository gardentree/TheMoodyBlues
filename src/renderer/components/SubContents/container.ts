import {connect} from "react-redux";
import Component from "./component";
import {updateTweetsInSubContents} from "@modules/subcontents";

const mapStateToProps = (state: any) => {
  const {subcontents} = state;

  return {
    tweets: subcontents.tweets || null,
  };
};
const mapDispatchToProps = {
  onClose: () => updateTweetsInSubContents(null),
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Component);
