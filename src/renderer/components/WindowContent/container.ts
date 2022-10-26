import {connect} from "react-redux";
import Component, {OwnProps, StateProps, ContentComponent} from "./component";
import Timeline from "../Timeline";
import Search from "../Search";
import adapters from "@libraries/adapter";

const components = new Map<string, ContentComponent>([
  ["Timeline", Timeline],
  ["Search", Search],
]);

const mapStateToProps = (state: TMB.State, own: OwnProps): StateProps => {
  const {preferences} = state;
  const preference = adapters.preferences.getSelectors().selectById(preferences, own.identifier)!;

  return {
    component: components.get(preference.screen.component)!,
  };
};
export default connect(mapStateToProps)(Component);
