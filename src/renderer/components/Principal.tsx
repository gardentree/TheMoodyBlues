import * as React from "react";
import {connect} from "react-redux";
import {selectTab} from "../modules/home";
import Timeline from "./Timeline";
import Search from "./Search";
import SubContents from "./SubContents";
import * as twitter from "../others/twitter";

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
    const {current, style, unreads} = this.props;

    const container = `.window-content[data-name='${current}']`;
    return (
      <div id="principal" className="window Principal" style={style}>
        <header className="toolbar toolbar-header">
          <h1 className="title">The Moody Blues</h1>
        </header>
        <div className="tab-group">
          {contents.map(({name, component}) => {
            const unread = unreads[name];

            return (
              <div
                key={name}
                className={`tab-item${current == name ? " active" : ""}`}
                onClick={() => {
                  this.props.dispatch(selectTab(name));
                }}
              >
                {name}
                {unread && <span className="unread_badge">{unread}</span>}
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
  const {tab, style, contents} = state.home;

  let unreads = {};
  if (contents) {
    Object.entries(contents).forEach(([tab, content]) => {
      const {tweets, lastReadID} = content as any;
      let count = tweets ? tweets.filter((tweet: twitter.Tweet) => tweet.id > lastReadID).length : 0;
      if (count <= 0) count = null;

      unreads[tab] = count;
    });
  }

  return {
    current: tab,
    style: style,
    unreads: unreads,
  };
};
export default connect(mapStateToProps)(Principal);
