import * as React from "react";

interface Property {
  identifier: string;
  showUserTimeline(): any;
}

const UserIdentifier: React.SFC<Property> = ({identifier, showUserTimeline}) => {
  return (
    <span className="UserIdentifier" onClick={showUserTimeline}>
      @{identifier}
    </span>
  );
};

export default UserIdentifier;
