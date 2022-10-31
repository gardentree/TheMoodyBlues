import React, {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import TabItem from "./TabItem";
import WindowContent from "./WindowContent";
import StatusBar from "./StatusBar";
import Dialog from "./Dialog";
import * as actions from "@actions";
import {css} from "@emotion/react";

type StateProps = TMB.Principal;

const Principal = () => {
  const {screens, focused, style, nowLoading} = useSelector<TMB.State, StateProps>((state) => {
    const {principal} = state;

    return principal;
  });

  const dispatch = useDispatch();
  function focusScreen(event: React.SyntheticEvent<HTMLElement>) {
    dispatch(actions.focusScreen(event.currentTarget.dataset.name!));
  }
  function focus(identifier: TMB.ScreenID) {
    dispatch(actions.focusScreen(identifier));
  }

  useEffect(() => {
    if (!screens.includes(focused)) {
      focus(screens[0]);
    }
  }, [screens]);

  if (screens.length <= 0) {
    return <div />;
  }

  return (
    <div id="principal" className="window" css={styles} style={style}>
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

const styles = css`
  .window-content {
    overflow: hidden;
  }

  .loading {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
