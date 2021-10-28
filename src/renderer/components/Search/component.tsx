import * as React from "react";
import TweetList from "../TweetList";
import {Field, InjectedFormProps} from "redux-form";

export interface OwnProperty {
  identity: TheMoodyBlues.Store.TimelineIdentity;
  handleSubmit: any;
}
export interface StateProperty {
  tweets: TweetType[];
  lastReadID: string;
  initialValues: {query: string};
  hasQuery: boolean;
}
export interface DispatchProperty {
  didMount: any;
  search: any;
}
type Property = OwnProperty & StateProperty & DispatchProperty & InjectedFormProps;

export default class Search extends React.Component<Property, any> {
  render() {
    const {identity, tweets, lastReadID, hasQuery, handleSubmit, search, reset} = this.props;

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
                  search("");
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
  }

  componentDidMount() {
    this.props.didMount();
  }
}
