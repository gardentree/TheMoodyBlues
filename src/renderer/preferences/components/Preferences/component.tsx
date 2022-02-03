import React, {Suspense} from "react";
import Timelines from "../Timelines";
import Mute from "../Mute";

const components: {[key: string]: React.FC} = {Timelines, Mute};

class Preferences extends React.Component<{}, {focus: string}> {
  state = {focus: "Timelines"};

  render() {
    const {focus} = this.state;

    return (
      <div className="Preferences">
        <div className="window">
          <header className="toolbar toolbar-header">
            <h1 className="title">Preferences</h1>
          </header>

          <div className="tab-group">
            {Object.entries(components).map(([title, component]) => {
              return (
                <div
                  key={title}
                  className={`tab-item${focus == title ? " active" : ""}`}
                  onClick={() => {
                    this.setState({focus: title});
                  }}
                >
                  {title}
                </div>
              );
            })}
          </div>

          {Object.entries(components).map(([title, component]) => {
            return (
              <div key={title} className="window-content" style={{display: focus == title ? "block" : "none"}}>
                <Suspense fallback={<p>Loading...</p>}>{React.createElement(component)}</Suspense>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Preferences;
