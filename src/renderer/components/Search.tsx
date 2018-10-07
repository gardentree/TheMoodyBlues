import * as React from "react";
import {connect} from "react-redux";
import {Field, reduxForm} from "redux-form";
import TweetList from "./TweetList";
import {mountComponent, searchTweets} from "../modules/home";

class Search extends React.Component<any, any> {
  render() {
    const {handleSubmit, search} = this.props;

    return (
      <React.Fragment>
        <div className="toolbar">
          <form className="search" onSubmit={handleSubmit(search)}>
            <Field name="query" component="input" type="search" className="form-control" />
          </form>
        </div>
        <div style={{height: "100%"}}>
          <TweetList tweets={this.props.tweets} />
        </div>
      </React.Fragment>
    );
  }

  componentDidMount() {
    this.props.dispatch(mountComponent("Search"));
  }
}

const mapStateToProps = (state: any) => {
  const {contents} = state.home;
  const content = contents["Search"];
  if (!content) return {tweets: []};

  return {
    tweets: content.tweets || [],
    query: content.query,
    initialValues: {query: content.query},
  };
};
const mapDispatchToProps = {
  search: (values: any) => searchTweets(values.query),
};

let container: any = Search;
container = reduxForm({
  form: "Search",
  enableReinitialize: true,
})(container);
container = connect(
  mapStateToProps,
  mapDispatchToProps
)(container);

export default container;
