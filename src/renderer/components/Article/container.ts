import {Dispatch} from "redux";
import {connect} from "react-redux";
import Component, {OwnProps, StateProps, DispatchProps} from "./component";
import * as actions from "@actions";
import adapters from "@libraries/adapter";

const {facade} = window;

const mapStateToProps = (state: TMB.State, own: OwnProps): StateProps => {
  const {screens} = state;
  const screen = adapters.screens.getSelectors().selectById(screens, own.identifier)!;

  return {
    ...screen,
  };
};
const mapDispatchToProps = (dispatch: Dispatch, own: OwnProps): DispatchProps => ({
  onMark: (latest: Twitter.TweetID): void => {
    const {identifier} = own;

    dispatch(actions.mark({identifier, lastReadID: latest}));
  },
  onShowModeMenu: (mode: TMB.ArticleMode): void => {
    const {identifier} = own;

    facade.actions.showModeMenu(identifier, mode);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Component);
