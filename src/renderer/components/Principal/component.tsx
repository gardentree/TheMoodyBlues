import * as React from "react";
import {useEffect} from "react";
import SubContents from "../SubContents";
import {CSSTransition} from "react-transition-group";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export type Content = React.ComponentType<{identity: string}>;
export interface TabItem {
  identity: string;
  title: string;
  component: Content;
}
export interface StateProps {
  current: string;
  style: TheMoodyBlues.PrincipalStyle;
  unreads: {[key: string]: number};
  subcontents: TheMoodyBlues.SubContents;
  nowLoading: boolean;
  items: TabItem[];
}
export interface DispatchProps {
  onClick(event: React.SyntheticEvent<HTMLElement>): void;
  didMount(identity: string): void;
}
type Property = StateProps & DispatchProps;

const Principal = (props: Property) => {
  const {current, style, unreads, onClick, nowLoading, subcontents, items, didMount} = props;

  if (items.length <= 0) {
    return <div />;
  }

  useEffect(() => {
    didMount(items[0].identity);
  }, []);

  return (
    <div id="principal" className="window Principal" style={style}>
      <header className="toolbar toolbar-header">
        <h1 className="title">The Moody Blues</h1>
      </header>
      <div className="tab-group">
        {items.map(({identity, title}) => {
          const unread = unreads[identity];

          return (
            <div key={identity} className={`tab-item${current == identity ? " active" : ""}`} data-name={identity} onClick={onClick}>
              {title}
              {unread > 0 && <span className="unread_badge">{unread}</span>}
            </div>
          );
        })}
      </div>
      {items.map(({identity, component}) => {
        const display = subcontents.tweets.length > 0;
        return (
          <div key={identity} className="window-content" style={{display: current == identity ? "block" : "none"}} data-name={identity}>
            {React.createElement(component, {identity: identity})}

            <CSSTransition timeout={300} classNames="fade" in={display}>
              <div className="subcontents" />
            </CSSTransition>
          </div>
        );
      })}
      <div className="loading" style={{display: nowLoading ? "flex" : "none"}}>
        <FontAwesomeIcon icon="spinner" size="4x" spin />
      </div>
      <SubContents container={`.window-content[data-name='${current}'] > .subcontents`} />
    </div>
  );
};
export default Principal;
