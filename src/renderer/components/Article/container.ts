import {connect} from "react-redux";
import {Dispatch} from "redux";
import Component from "./component";
import {OwnProperty, DispatchProperty} from "./component";
import * as actions from "@actions";

const {facade} = window;

const mapDispatchToProps = (dispatch: Dispatch, own: OwnProperty): DispatchProperty => ({
  onScroll: (event: React.SyntheticEvent<HTMLElement>): void => {
    const {identity, tweets, lastReadID} = own;
    if ((event.target as HTMLElement).scrollTop <= 0 && tweets.length > 0 && lastReadID != null && lastReadID < tweets[0].id_str) {
      dispatch(actions.read(identity, tweets[0].id));
    }
  },
  onChangeMode: (event: React.SyntheticEvent<HTMLElement>): void => {
    const {identity, mode} = own;
    facade.actions.showModeMenu(identity, mode);
  },
});

export default connect(null, mapDispatchToProps)(Component);
