import * as React from "react";
import TweetList from "../TweetList";
import {Field} from "redux-form";

interface Property {
  tweets: TweetType[];
  lastReadID: number;
  initialValues: {query: string};
  hasQuery: boolean;
  handleSubmit: any;
  search: any;
  reset: any;
  didMount: any;
}

export default class Search extends React.Component<Property, any> {
  render() {
    const {tweets, lastReadID, hasQuery, handleSubmit, search, reset} = this.props;

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
          <TweetList tweets={tweets} lastReadID={lastReadID} />
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.props.didMount();
  }
}
