import * as React from "react";
import {connect} from "react-redux";
import {Field, reduxForm} from "redux-form";
import {TweetList} from "./TweetList";
import * as actions from "../actions";

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
    this.props.dispatch(actions.mountComponent(Search.name));
  }
}

const mapStateToProps = (state: any) => {
  const content = state.contents[Search.name];
  if (!content) return {tweets: []};

  return {
    tweets: content.tweets || [],
    query: content.query,
    initialValues: {query: content.query},
  };
};
const mapDispatchToProps = {
  search: (values: any) => actions.searchTweets(values.query),
};

let container: any = Search;
container = reduxForm({
  form: Search.name,
  enableReinitialize: true,
})(container);
container = connect(
  mapStateToProps,
  mapDispatchToProps
)(container);

Object.defineProperty(container, "name", {value: "Search"});
export default container;
