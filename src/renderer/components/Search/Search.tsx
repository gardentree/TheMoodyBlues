import * as React from "react";
import TweetList from "../TweetList";
import {Field} from "redux-form";
import * as twitter from "../../others/twitter";

interface Property {
  tweets: twitter.Tweet[];
  lastReadID: number;
  initialValues: {query: string};
  handleSubmit: any;
  search: any;
  didMount: any;
}

export default class Search extends React.Component<Property, any> {
  render() {
    const {tweets, lastReadID, handleSubmit, search} = this.props;

    return (
      <React.Fragment>
        <div className="toolbar">
          <form className="search" onSubmit={handleSubmit(search)}>
            <Field name="query" component="input" type="search" className="form-control" />
          </form>
        </div>
        <div style={{height: "100%"}}>
          <TweetList tweets={tweets} lastReadID={lastReadID} />
        </div>
      </React.Fragment>
    );
  }

  componentDidMount() {
    this.props.didMount();
  }
}
