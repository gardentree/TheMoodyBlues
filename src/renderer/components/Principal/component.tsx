import React, {useEffect} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import TabItem from "../TabItem";
import WindowContent from "../WindowContent";
import StatusBar from "../StatusBar";
import Dialog from "../Dialog";

export interface DispatchProps {
  focusScreen(event: React.SyntheticEvent<HTMLElement>): void;
  focus(identifier: TMB.ScreenID): void;
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
        {screens.map((identifier) => {
          return (
            <div key={identifier} className={`tab-item${focused == identifier ? " active" : ""}`} data-name={identifier} onClick={focusScreen}>
              <TabItem identifier={identifier} />
            </div>
          );
        })}
      </div>

      {screens.map((identifier) => {
        return (
          <div key={identifier} className="window-content" style={{display: focused == identifier ? "block" : "none"}} data-name={identifier}>
            <WindowContent identifier={identifier} />
          </div>
        );
      })}
      <footer className="toolbar toolbar-footer">
        <StatusBar />
      </footer>
      <div className="loading" style={{display: nowLoading ? "flex" : "none"}}>
        <FontAwesomeIcon icon="spinner" size="4x" spin />
      </div>
      <Dialog />
    </div>
  );
};
export default Principal;
