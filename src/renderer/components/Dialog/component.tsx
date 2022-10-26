import React from "react";
import {Global, css} from "@emotion/react";
import Modal from "react-modal";
import Gatekeeper from "./Gatekeeper";

export type StateProps = {dialog: TMB.Dialog};
export interface DispatchProps {
  requestClose(): void;
}
type Props = StateProps & DispatchProps;

const Dialog = (props: Props) => {
  const {dialog, requestClose} = props;

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
    case "mute":
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
            <Gatekeeper context={dialog.context} requestClose={requestClose} />
          </Modal>
        </>
      );
    default:
      return <Modal isOpen={false} />;
  }
};

export default Dialog;
