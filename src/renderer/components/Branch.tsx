import {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import Article from "./Article";
import adapters from "@libraries/adapter";
import * as actions from "@actions";
import {css} from "@emotion/react";

interface OwnProps {
  root: TMB.ScreenID;
  identifier: TMB.ScreenID;
}
type StateProps = TMB.Screen;

const Branch = (props: OwnProps) => {
  const {root, identifier} = props;

  const {options} = useSelector<TMB.State, StateProps>((state) => {
    const {screens} = state;
    const screen = adapters.screens.getSelectors().selectById(screens, identifier)!;

    return screen;
  });

  const dispatch = useDispatch();
  function onClose() {
    dispatch(actions.clip({root: root, branch: identifier}));
  }
  function didMount(source: Twitter.Tweet) {
    dispatch(actions.focusTweet(source));
  }

  useEffect(() => {
    if (options?.source) {
      didMount(options!.source);
    }
  }, []);

  return (
    <div css={styles}>
      <Article identifier={identifier}>
        <button className="btn btn-default" onClick={onClose}>
          <span className="icon icon-cancel" />
        </button>
      </Article>
    </div>
  );
};
export default Branch;

const styles = css`
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  .header {
    position: fixed;
    top: 56px;
    left: 0;
    right: 0;
    padding: 3px;
  }

  &.fade-enter {
    display: block;
    left: 500px;
  }
  &.fade-enter-active {
    left: 0;
    transition: all 300ms 0s ease;
  }
  &.fade-enter-done {
    display: block;
  }

  &.fade-exit {
    display: block;
    left: 0;
  }
  &.fade-exit-active {
    left: 500px;
    transition: all 300ms 0s ease;
  }
  &.fade-exit-done {
    display: none;
  }
`;
