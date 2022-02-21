import * as React from "react";
import {useEffect} from "react";
import Article from "../Article";
import {reduxForm, Field, InjectedFormProps} from "redux-form";

export interface OwnProperty {
  identity: TMB.ScreenID;
}
export interface StateProperty {
  tweets: Twitter.Tweet[];
  mode: TMB.ArticleMode;
  lastReadID: string;
  initialValues: {query: string};
  hasQuery: boolean;
}
export interface DispatchProperty {
  didMount(): void;
  search(values: {query: string}): void;
}
export interface FormProperty {
  query: string;
}
type ComponentProperty = OwnProperty & StateProperty & DispatchProperty;
type Property = ComponentProperty & InjectedFormProps<FormProperty, ComponentProperty>;

const Search = (props: Property) => {
  const {identity, tweets, mode, lastReadID, hasQuery, handleSubmit, search, reset, didMount} = props;

  useEffect(() => {
    didMount();
  }, []);

  return (
    <div className="Search">
      <div style={{height: "100%"}}>
        <Article identity={identity} tweets={tweets} mode={mode} lastReadID={lastReadID}>
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
      </div>
    </div>
  );
};

export default reduxForm<FormProperty, ComponentProperty>({
  form: "Search",
  enableReinitialize: true,
})(Search);
