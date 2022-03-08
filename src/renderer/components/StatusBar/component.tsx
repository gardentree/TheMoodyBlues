import React from "react";

type Props = TMB.ScreenStatus;

const StatusBar = (props: Props) => {
  const {status} = props;

  return (
    <div className="StatusBar">
      <h1 className="title">{status}</h1>
    </div>
  );
};
export default StatusBar;
