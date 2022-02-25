import {connect} from "react-redux";
import {Dispatch} from "redux";
import Component from "./component";
import {OwnProps, StateProps, DispatchProps} from "./component";
import * as actions from "@actions";

const {facade} = window;

const mapStateToProps = (state: TMB.State, own: OwnProps): StateProps => {
  const {screens} = state;
  const screen = screens.get(own.identity)!;

  return {
    ...screen,
  };
};
const mapDispatchToProps = (dispatch: Dispatch, own: OwnProps): DispatchProps => ({
  onMark: (latest: Twitter.TweetID): void => {
    const {identity} = own;

    dispatch(actions.mark(identity, latest));
  },
  onShowModeMenu: (mode: TMB.ArticleMode): void => {
    const {identity} = own;

    facade.actions.showModeMenu(identity, mode);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Component);
