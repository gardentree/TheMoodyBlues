import * as React from "react";
import Mute from "../Mute";

class Preferences extends React.Component<{}, {focus: string}> {
  state = {focus: Mute.name};

  render() {
    const {focus} = this.state;
    const tabs = [Mute];

    return (
      <div className="Preferences">
        <div className="window">
          <header className="toolbar toolbar-header">
            <h1 className="title">Preferences</h1>
          </header>

          <div className="tab-group">
            {tabs.map((tab) => {
              return (
                <div
                  key={tab.name}
                  className={`tab-item${focus == tab.name ? " active" : ""}`}
                  onClick={() => {
                    this.setState({focus: tab.name});
                  }}
                >
                  {tab.name}
                </div>
              );
            })}
          </div>

          {tabs.map((tab) => {
            return (
              <div key={tab.name} className="window-content" style={{display: focus == tab.name ? "block" : "none"}}>
                {React.createElement(tab)}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Preferences;
