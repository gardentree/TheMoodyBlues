import * as React from "react";
import Timeline from "../Timeline";
import Search from "../Search";
import SubContents from "../SubContents";
import {CSSTransition} from "react-transition-group";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface Property {
  current: string;
  style: any;
  unreads: any;
  onClick: any;
  subcontents: any;
  nowLoading: boolean;
  timelines: Map<string, TheMoodyBlues.Timeline>;
  didMount: any;
}

const componets = new Map([
  ["Timeline", Timeline],
  ["Search", Search],
]);

export default class Principal extends React.Component<Property, any> {
  render() {
    const {current, style, unreads, onClick, nowLoading, timelines} = this.props;

    const contents: {identity: string; title: string; component: any}[] = Array.from(timelines.entries()).map(([identity, timeline]) => ({
      identity: identity,
      title: timeline.preference.title,
      component: componets.get(timeline.preference.component),
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
                {unread && <span className="unread_badge">{unread}</span>}
              </div>
            );
          })}
        </div>
        {contents.map(({identity, component}) => {
          const display = !!this.props.subcontents.tweets;
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
  }
  componentDidMount() {
    const {timelines} = this.props;
    this.props.didMount(timelines.keys().next().value);
  }
}
