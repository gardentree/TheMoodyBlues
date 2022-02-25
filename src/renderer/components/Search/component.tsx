import React,{useEffect} from "react";
import Article from "../Article";
import BranchBundle from "../BranchBundle";
import {reduxForm, Field, InjectedFormProps} from "redux-form";

export interface OwnProps {
  identity: TMB.ScreenID;
}
export interface StateProps {
  initialValues: {query: string};
  hasQuery: boolean;
  branches: TMB.ScreenID[];
}
export interface DispatchProps {
  didMount(): void;
  search(values: {query: string}): void;
}
export interface FormProperty {
  query: string;
}
type ComponentProperty = OwnProps & StateProps & DispatchProps;
type Props = ComponentProperty & InjectedFormProps<FormProperty, ComponentProperty>;

const Search = (props: Props) => {
  const {identity, hasQuery, branches, handleSubmit, search, reset, didMount} = props;

  useEffect(() => {
    didMount();
  }, []);

  return (
    <div className="Search">
      <div style={{height: "100%"}}>
        <Article identity={identity}>
          <form className="search" onSubmit={handleSubmit(search)}>
            <div className="field">
              <Field name="query" component="input" type="search" className="form-control" />
              <span
                className="icon icon-cancel-circled"
                style={{display: hasQuery ? "inline-block" : "none"}}
                onClick={() => {
                  reset();
                  search({query: ""});
                }}
              />
            </div>
          </form>
        </Article>

        <BranchBundle root={identity} branches={branches} />
      </div>
    </div>
  );
};

export default reduxForm<FormProperty, ComponentProperty>({
  form: "Search",
  enableReinitialize: true,
})(Search);
