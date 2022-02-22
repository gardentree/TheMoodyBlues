import * as React from "react";
import Article from "../Article";

export interface OwnProps {
  root: TMB.ScreenID;
  identity: TMB.ScreenID;
}
export interface DispatchProps {
  onClose(): void;
}
type Props = OwnProps & TMB.Screen & DispatchProps;

const Branch = (props: Props) => {
  const {identity, tweets, mode, onClose} = props;

  return (
    <div className="Branch">
      <Article identity={identity} tweets={tweets} mode={mode} lastReadID={null}>
        <button className="btn btn-default" onClick={onClose}>
          <span className="icon icon-cancel" />
        </button>
      </Article>
    </div>
  );
};

export default Branch;
