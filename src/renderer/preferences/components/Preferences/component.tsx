import React, {useState} from "react";
import Screen from "../Screen";
import Gatekeeper from "../Gatekeeper";

const components: {[key: string]: React.FC} = {Gatekeeper, Screen};

const Preferences = () => {
  const [active, setActive] = useState("Gatekeeper");

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
                className={`tab-item${active == title ? " active" : ""}`}
                onClick={() => {
                  setActive(title);
                }}
              >
                {title}
              </div>
            );
          })}
        </div>

        {Object.entries(components).map(([title, component]) => {
          return (
            <div key={title} className="window-content" style={{display: active == title ? "block" : "none"}}>
              {React.createElement(component)}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Preferences;
