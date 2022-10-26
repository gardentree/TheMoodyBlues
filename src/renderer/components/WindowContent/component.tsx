import React from "react";

export interface OwnProps {
  identifier: TMB.ScreenID;
}
export type ContentComponent = React.ComponentType<{identifier: TMB.ScreenID}>;
export interface StateProps {
  component: ContentComponent;
}
type Props = OwnProps & StateProps;

const WindowContent = (props: Props) => {
  const {identifier, component} = props;

  return React.createElement(component, {identifier: identifier});
};
export default WindowContent;
