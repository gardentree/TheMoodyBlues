import * as React from "react";

interface Property {
  identifier: string;
  showUserTimeline(event: React.SyntheticEvent): any;
}

const UserIdentifier: React.SFC<Property> = ({identifier, showUserTimeline}) => {
  return (
    <span className="UserIdentifier" onClick={showUserTimeline}>
      @{identifier}
    </span>
  );
};

export default UserIdentifier;