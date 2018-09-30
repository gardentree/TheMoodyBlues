import * as React from "react";
import {connect} from "react-redux";
import * as screen from "../modules/screen";
import Timeline from "./Timeline";
import Search from "./Search";
import SubContents from "./SubContents";

class Principal extends React.Component<any, any> {
  render() {
    const contents = [
      {
        name: "Timeline",
        component: Timeline,
      },
      {
        name: "Search",
        component: Search,
      },
    ];
    const {current, style} = this.props;

    const container = `.window-content[data-name='${current}']`;

    return (
      <div id="principal" className="window" style={style}>
        <header className="toolbar toolbar-header">
          <h1 className="title">The Moody Blues</h1>
        </header>
        <div className="tab-group">
          {contents.map(({name, component}) => {
            return (
              <div
                key={name}
                className={`tab-item${current == name ? " active" : ""}`}
                onClick={() => {
                  this.props.dispatch(screen.select(name));
                }}
              >
                {name}
              </div>
            );
          })}
        </div>
        {contents.map(({name, component}) => {
          return (
            <div key={name} className="window-content" style={{display: current == name ? "block" : "none"}} data-name={name}>
              {React.createElement(component as React.ClassType<any, any, any>, {
                twitter: this.props.twitter,
              })}
            </div>
          );
        })}
        <SubContents container={container} />
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    current: state.screen.name || "Timeline",
    style: state.style,
  };
};
export default connect(mapStateToProps)(Principal);
