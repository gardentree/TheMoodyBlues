import * as React from "react";

interface Form extends HTMLFormElement {
  verifier: HTMLInputElement;
}
interface Property {
  callback(verifier: string): void;
}
const VerifierForm = (props: Property) => {
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
      <div className="window-content">
        <div className="VerifierForm">
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
