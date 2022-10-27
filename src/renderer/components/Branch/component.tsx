import React, {useEffect} from "react";
import Article from "../Article";

export interface OwnProps {
  root: TMB.ScreenID;
  identifier: TMB.ScreenID;
}
export interface DispatchProps {
  onClose(): void;
  didMount(source: Twitter.Tweet): void;
}
type Props = OwnProps & TMB.Screen & DispatchProps;

const Branch = (props: Props) => {
  const {identifier, options, onClose, didMount} = props;

  useEffect(() => {
    if (options?.source) {
      didMount(options!.source);
    }
  }, []);

  return (
    <div className="Branch">
      <Article identifier={identifier}>
        <button className="btn btn-default" onClick={onClose}>
          <span className="icon icon-cancel" />
        </button>
      </Article>
    </div>
  );
};

export default Branch;
