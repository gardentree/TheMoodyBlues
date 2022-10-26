import {connect, ConnectedProps} from "react-redux";
import Component from "./component";
import * as actions from "@actions";

const mapDispatchToProps = {
  addTaboo: actions.addTaboo,
};
const connector = connect(null, mapDispatchToProps);

export type DispatchProps = ConnectedProps<typeof connector>;
export default connector(Component);
