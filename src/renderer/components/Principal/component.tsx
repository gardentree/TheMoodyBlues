import React, {useEffect} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import TabItem from "../TabItem";
import WindowContent from "../WindowContent";
import StatusBar from "../StatusBar";

export interface DispatchProps {
  focusScreen(event: React.SyntheticEvent<HTMLElement>): void;
  focus(identity: TMB.ScreenID): void;
}
type Props = TMB.Principal & DispatchProps;

const Principal = (props: Props) => {
  const {screens, focused, style, focusScreen, nowLoading, focus} = props;

  useEffect(() => {
    if (!screens.includes(focused)) {
      focus(screens[0]);
    }
  }, [screens]);

  if (screens.length <= 0) {
    return <div />;
  }

  return (
    <div id="principal" className="window Principal" style={style}>
      <header className="toolbar toolbar-header">
        <h1 className="title">The Moody Blues</h1>
      </header>
      <div className="tab-group">
        {screens.map((identity) => {
          return (
            <div key={identity} className={`tab-item${focused == identity ? " active" : ""}`} data-name={identity} onClick={focusScreen}>
              <TabItem identity={identity} />
            </div>
          );
        })}
      </div>

      {screens.map((identity) => {
        return (
          <div key={identity} className="window-content" style={{display: focused == identity ? "block" : "none"}} data-name={identity}>
            <WindowContent identity={identity} />
          </div>
        );
      })}
      <footer className="toolbar toolbar-footer">
        <StatusBar />
      </footer>
      <div className="loading" style={{display: nowLoading ? "flex" : "none"}}>
        <FontAwesomeIcon icon="spinner" size="4x" spin />
      </div>
    </div>
  );
};
export default Principal;
