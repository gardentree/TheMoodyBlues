import * as React from "react";
import Timeline from "../Timeline";
import Search from "../Search";
import SubContents from "../SubContents";

interface Property {
  current: string;
  style: any;
  unreads: any;
  onClick: any;
}

export default class Principal extends React.Component<Property, any> {
  contents = [
    {
      name: "Timeline",
      component: Timeline,
    },
    {
      name: "Search",
      component: Search,
    },
  ];

  render() {
    const {current, style, unreads, onClick} = this.props;

    const container = `.window-content[data-name='${current}']`;
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
          return (
            <div key={name} className="window-content" style={{display: current == name ? "block" : "none"}} data-name={name}>
              {React.createElement(component as React.ClassType<any, any, any>, {})}
            </div>
          );
        })}
        <SubContents container={container} />
      </div>
    );
  }
}
