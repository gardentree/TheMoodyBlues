import React, {useState} from "react";
import Backstage from "./Preferences/Backstage";
import Gatekeeper from "./Preferences/Gatekeeper";

interface OwnProps {
  requestClose(): void;
}

const components: {[key: string]: React.FC} = {Gatekeeper, Backstage};

const Preferences = (_props: OwnProps) => {
  const [active, setActive] = useState("Gatekeeper");

  return (
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
              <span>{title}</span>
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
  );
};
export default Preferences;
