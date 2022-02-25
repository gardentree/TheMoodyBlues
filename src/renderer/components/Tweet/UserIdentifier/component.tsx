import React from "react";

interface Props {
  identifier: string;
  showUserTimeline(event: React.SyntheticEvent): void;
}

const UserIdentifier: React.SFC<Props> = ({identifier, showUserTimeline}) => {
  return (
    <span className="UserIdentifier" onClick={showUserTimeline}>
      @{identifier}
    </span>
  );
};

export default UserIdentifier;
