import * as React from "react";
import {useEffect} from "react";
import TweetList from "../TweetList";
import {reduxForm, Field, InjectedFormProps} from "redux-form";

export interface OwnProperty {
  identity: TimelineIdentity;
}
export interface StateProperty {
  tweets: Twitter.Tweet[];
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
  const {identity, tweets, lastReadID, hasQuery, handleSubmit, search, reset, didMount} = props;

  useEffect(() => {
    didMount();
  }, []);

  return (
    <div className="Search">
      <div className="toolbar">
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
      </div>
      <div style={{height: "100%"}}>
        <TweetList identity={identity} tweets={tweets} lastReadID={lastReadID} />
      </div>
    </div>
  );
};

export default reduxForm<FormProperty, ComponentProperty>({
  form: "Search",
  enableReinitialize: true,
})(Search);
