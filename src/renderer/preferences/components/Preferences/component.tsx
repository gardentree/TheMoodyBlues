import React, {Suspense} from "react";
import Timelines from "../Timelines";
import Mute from "../Mute";

class Preferences extends React.Component<{}, {focus: string}> {
  state = {focus: Timelines.name};

  render() {
    const {focus} = this.state;
    const tabs = [Timelines, Mute];

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
                <Suspense fallback={<p>Loading...</p>}>{React.createElement<any>(tab)}</Suspense>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Preferences;
