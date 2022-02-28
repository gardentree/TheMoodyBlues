import React, {useEffect} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import TabItem from "../TabItem";
import WindowContent from "../WindowContent";
import StatusBar from "../StatusBar";

export interface StateProps {
  screens: TMB.ScreenID[];
  current: string;
  style: TMB.PrincipalStyle;
  nowLoading: boolean;
}
export interface DispatchProps {
  focusScreen(event: React.SyntheticEvent<HTMLElement>): void;
  didMount(identity: string): void;
}
type Props = StateProps & DispatchProps;

const Principal = (props: Props) => {
  const {screens, current, style, focusScreen, nowLoading, didMount} = props;

  if (screens.length <= 0) {
    return <div />;
  }

  useEffect(() => {
    didMount(screens[0]);
  }, []);

  return (
    <div id="principal" className="window Principal" style={style}>
      <header className="toolbar toolbar-header">
        <h1 className="title">The Moody Blues</h1>
      </header>
      <div className="tab-group">
        {screens.map((identity) => {
          return (
            <div key={identity} className={`tab-item${current == identity ? " active" : ""}`} data-name={identity} onClick={focusScreen}>
              <TabItem identity={identity} />
            </div>
          );
        })}
      </div>

      {screens.map((identity) => {
        return (
          <div key={identity} className="window-content" style={{display: current == identity ? "block" : "none"}} data-name={identity}>
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
