import React from "react";

export interface OwnProps {
  identity: TMB.ScreenID;
}
export interface StateProps {
  title: string;
  unread: number;
}
type Props = OwnProps & StateProps;

const TabItem = (props: Props) => {
  const {title, unread} = props;

  return (
    <div className="TabItem">
      {title}
      {unread > 0 && <span className="unread_badge">{unread}</span>}
    </div>
  );
};
export default TabItem;
