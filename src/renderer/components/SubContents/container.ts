import {connect} from "react-redux";
import Component from "./component";
import {updateTweetsInSubContents} from "../../modules/home";

const mapStateToProps = (state: any) => {
  const {subcontents} = state.home;

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
