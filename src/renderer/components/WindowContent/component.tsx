import React from "react";

export interface OwnProps {
  identity: TMB.ScreenID;
}
export type ContentComponent = React.ComponentType<{identity: TMB.ScreenID}>;
export interface StateProps {
  component: ContentComponent;
}
type Props = OwnProps & StateProps;

const WindowContent = (props: Props) => {
  const {identity, component} = props;

  return React.createElement(component, {identity: identity});
};
export default WindowContent;
