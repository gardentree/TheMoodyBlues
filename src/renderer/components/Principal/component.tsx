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
}

export default class Principal extends React.Component<Property, any> {
  contents = [
    {
      name: "Timeline",
      component: Timeline("Timeline"),
    },
    {
      name: "Search",
      component: Search,
    },
    {
      name: "Mentions",
      component: Timeline("Mentions"),
    },
  ];

  render() {
    const {current, style, unreads, onClick, nowLoading} = this.props;

    return (
      <div id="principal" className="window Principal" style={style}>
        <header className="toolbar toolbar-header">
          <h1 className="title">The Moody Blues</h1>
        </header>
        <div className="tab-group">
          {this.contents.map(({name, component}) => {
            const unread = unreads[name];

            return (
              <div key={name} className={`tab-item${current == name ? " active" : ""}`} data-name={name} onClick={onClick}>
                {name}
                {unread && <span className="unread_badge">{unread}</span>}
              </div>
            );
          })}
        </div>
        {this.contents.map(({name, component}) => {
          const display = !!this.props.subcontents.tweets;
          return (
            <div key={name} className="window-content" style={{display: current == name ? "block" : "none"}} data-name={name}>
              {React.createElement(component as React.ClassType<any, any, any>, {})}

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
}
