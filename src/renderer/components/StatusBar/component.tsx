import React from "react";
import * as DateUtility from "date-fns";

export interface StateProps {
  state: TMB.ScreenState | null;
}
type Props = StateProps;

const StatusBar = (props: Props) => {
  const {state} = props;

  return (
    <div className="StatusBar">
      {state && (
        <h1 className="title">
          {state.action} {DateUtility.format(state.time, "yyyy-MM-dd HH:mm:ss")}
        </h1>
      )}
    </div>
  );
};
export default StatusBar;
