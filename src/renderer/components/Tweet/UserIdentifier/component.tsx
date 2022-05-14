import React from "react";

export interface OwnProps {
  identifier: Twitter.ScreenName;
}
export interface DispatchProps {
  showUserTimeline(event: React.SyntheticEvent): void;
}

type Props = OwnProps & DispatchProps;

const UserIdentifier = (props: Props) => {
  const {identifier, showUserTimeline} = props;
  return (
    <span className="UserIdentifier" onClick={showUserTimeline}>
      @{identifier}
    </span>
  );
};

export default UserIdentifier;
