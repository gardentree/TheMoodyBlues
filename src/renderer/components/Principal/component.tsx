import * as React from "react";
import {useEffect} from "react";
import Timeline from "../Timeline";
import Search from "../Search";
import SubContents from "../SubContents";
import {CSSTransition} from "react-transition-group";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface Property {
  current: string;
  style: PrincipalStyle;
  unreads: {[key: string]: number};
  onClick(event: React.SyntheticEvent<HTMLElement>): void;
  subcontents: SubContents;
  nowLoading: boolean;
  timelines: TimelineMap;
  didMount(identity: string): void;
}

const components = new Map([
  ["Timeline", Timeline],
  ["Search", Search],
]);

const Principal = (props: Property) => {
  const {current, style, unreads, onClick, nowLoading, timelines, subcontents, didMount} = props;

  useEffect(() => {
    didMount(timelines.keys().next().value);
  }, []);

  const contents: {identity: string; title: string; component: React.FC}[] = Array.from(timelines.entries()).map(([identity, timeline]) => ({
    identity: identity,
    title: timeline.preference.title,
    component: components.get(timeline.preference.component),
  }));

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
        const display = subcontents.tweets.length > 0;
        return (
          <div key={identity} className="window-content" style={{display: current == identity ? "block" : "none"}} data-name={identity}>
            {React.createElement<typeof Timeline | typeof Search>(component, {identity: identity})}

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

// }
// componentDidMount() {
//   const {timelines} = this.props;
//   this.props.didMount(timelines.keys().next().value);
// }
