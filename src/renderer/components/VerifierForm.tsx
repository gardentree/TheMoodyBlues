import {css} from "@emotion/react";

interface Form extends HTMLFormElement {
  verifier: HTMLInputElement;
}
interface OwnProps {
  callback(verifier: string): void;
}

const VerifierForm = (props: OwnProps) => {
  const {callback} = props;

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    const form: Form = event.target as Form;
    callback(form.verifier.value);
  };

  return (
    <div className="window">
      <header className="toolbar toolbar-header">
        <h1 className="title">The Moody Blues</h1>
      </header>
      <div className="window-content theme">
        <div css={styles}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Enter PIN code</label>
              <input type="text" name="verifier" className="form-control" />
            </div>
            <div className="form-group">
              <input type="submit" value="Enter" className="form-control" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default VerifierForm;

const styles = css({
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});
