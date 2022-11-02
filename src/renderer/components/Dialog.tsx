import {useSelector, useDispatch} from "react-redux";
import {Global, css} from "@emotion/react";
import Modal from "react-modal";
import Taboo from "./Dialog/Taboo";
import * as actions from "@actions";
import Preferences from "./Dialog/Preferences";

type StateProps = {dialog: TMB.Dialog};

const Dialog = () => {
  const {dialog} = useSelector<TMB.State, StateProps>((state) => {
    const {dialog} = state.principal;

    return {dialog};
  });

  const dispatch = useDispatch();
  function requestClose() {
    dispatch(actions.closeDialog());
  }

  const style = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  switch (dialog?.type) {
    case "taboo":
      return (
        <>
          <Global
            styles={css`
              #principal .ReactModal__Overlay {
                background-color: initial !important;
              }
            `}
          />
          <Modal isOpen={true} onRequestClose={requestClose} style={style} parentSelector={() => document.querySelector("#principal")!}>
            <Taboo context={dialog.context} requestClose={requestClose} />
          </Modal>
        </>
      );
    case "preferences":
      return (
        <Modal isOpen={true} onRequestClose={requestClose} parentSelector={() => document.querySelector("#principal")!}>
          <Preferences requestClose={requestClose} />
        </Modal>
      );
    default:
      return <Modal isOpen={false} />;
  }
};

export default Dialog;
