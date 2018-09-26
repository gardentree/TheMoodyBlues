import {connect} from "react-redux";
import Component from "./SubContents";
import * as subcontents from "../../modules/subcontents";

const mapStateToProps = (state: any) => {
  return {
    tweets: state.subcontents.tweets || null,
  };
};
const mapDispatchToProps = {
  onClose: () => subcontents.update(null),
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Component);
