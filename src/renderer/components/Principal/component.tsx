import React, {useEffect} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export type ContentComponent = React.ComponentType<{identity: string}>;
export interface ScreenContent {
  identity: string;
  title: string;
  component: ContentComponent;
}
export interface StateProps {
  current: string;
  style: TMB.PrincipalStyle;
  unreads: {[key: string]: number};
  nowLoading: boolean;
  contents: ScreenContent[];
}
export interface DispatchProps {
  onClick(event: React.SyntheticEvent<HTMLElement>): void;
  didMount(identity: string): void;
}
type Props = StateProps & DispatchProps;

const Principal = (props: Props) => {
  const {current, style, unreads, onClick, nowLoading, contents, didMount} = props;

  if (contents.length <= 0) {
    return <div />;
  }

  useEffect(() => {
    didMount(contents[0].identity);
  }, []);

  return (
    <div id="principal" className="window Principal" style={style}>
      <header className="toolbar toolbar-header">
        <h1 className="title">The Moody Blues</h1>
      </header>
      <div className="tab-group">
        {contents.map(({identity, title}) => {
          const unread = unreads[identity];

          return (
            <div key={identity} className={`tab-item${current == identity ? " active" : ""}`} data-name={identity} onClick={onClick}>
              {title}
              {unread > 0 && <span className="unread_badge">{unread}</span>}
            </div>
          );
        })}
      </div>

      {contents.map(({identity, component}) => {
        return (
          <div key={identity} className="window-content" style={{display: current == identity ? "block" : "none"}} data-name={identity}>
            {React.createElement(component, {identity: identity})}
          </div>
        );
      })}
      <div className="loading" style={{display: nowLoading ? "flex" : "none"}}>
        <FontAwesomeIcon icon="spinner" size="4x" spin />
      </div>
    </div>
  );
};
export default Principal;
