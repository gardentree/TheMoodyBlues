import * as React from "react";
import {connect} from "react-redux";
import * as screen from "../modules/screen";
import Timeline from "./Timeline";
import Search from "./Search";
import SubContents from "./SubContents";

class Principal extends React.Component<any, any> {
  render() {
    const contents = [Timeline, Search];
    const current = this.props.current;

    const container = `.window-content[data-name='${current}']`;

    return (
      <div id="principal" className="window">
        <header className="toolbar toolbar-header">
          <h1 className="title">The Moody Blues</h1>
        </header>
        <div className="tab-group">
          {contents.map((content) => {
            return (
              <div
                key={content.name}
                className={`tab-item${current == content.name ? " active" : ""}`}
                onClick={() => {
                  this.props.dispatch(screen.select(content.name));
                }}
              >
                {content.name}
              </div>
            );
          })}
        </div>
        {contents.map((content) => {
          return (
            <div key={content.name} className="window-content" style={{display: current == content.name ? "block" : "none"}} data-name={content.name}>
              {React.createElement(content as React.ClassType<any, any, any>, {
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
    current: state.screen.name || Timeline.name,
  };
};
export default connect(mapStateToProps)(Principal);
