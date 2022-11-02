import React from "react";
import {useSelector} from "react-redux";
import adapters from "@libraries/adapter";
import Timeline from "./Timeline";
import Search from "./Search";

interface OwnProps {
  identifier: TMB.ScreenID;
}
type ContentComponent = React.ComponentType<{identifier: TMB.ScreenID}>;
interface StateProps {
  component: ContentComponent;
}

const components = new Map<string, ContentComponent>([
  ["Timeline", Timeline],
  ["Search", Search],
]);

const WindowContent = (props: OwnProps) => {
  const {identifier} = props;
  const {component} = useSelector<TMB.State, StateProps>((state) => {
    const {backstages} = state;
    const preference = adapters.backstages.getSelectors().selectById(backstages, identifier)!;

    return {
      component: components.get(preference.component)!,
    };
  });

  return React.createElement(component, {identifier: identifier});
};
export default WindowContent;
