import * as React from "react";
import {test} from "@libraries/silencer";

const {facade} = window;

interface Form extends HTMLFormElement {
  keyword: HTMLInputElement;
}

class Mute extends React.Component<{}, {keywords: string[]; tweets: Twitter.Tweet[]; matched: string[]}> {
  state = {keywords: facade.storage.getMuteKeywords(), tweets: [], matched: []};

  handleSubmit = (event: React.SyntheticEvent<Form>) => {
    event.preventDefault();

    const keyword = event.currentTarget.keyword.value.toLowerCase();
    this.state.keywords.push(keyword);
    this.state.keywords.sort();
    this.state.keywords = [...new Set(this.state.keywords)];

    facade.storage.setMuteKeywords(this.state.keywords);

    event.currentTarget.keyword.value = "";
    this.setState({keywords: this.state.keywords, matched: []});
  };

  handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.keyCode == 8) {
      const keyword = event.currentTarget.textContent!;
      const index = this.state.keywords.indexOf(keyword);
      this.state.keywords.splice(index, 1);

      facade.storage.setMuteKeywords(this.state.keywords);
      this.setState({keywords: this.state.keywords});
    }
  };

  handleChangeEntry = (event: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = event.currentTarget.value;

    if (keyword.length > 0) {
      const matched: string[] = this.state.tweets.map((tweet) => test(tweet, [keyword])).filter((result) => result) as string[];

      this.setState({matched: matched});
    } else {
      this.setState({matched: []});
    }
  };

  componentDidMount() {
    const promises = facade.storage
      .getTimelinePreferences()
      .filter((preference) => preference.mute)
      .map((preference: TheMoodyBlues.Store.TimelinePreference) => {
        return facade.storage.getTweets(preference.identity);
      });

    Promise.all(promises).then((allTweets: Twitter.Tweet[][]) => {
      this.setState({tweets: allTweets.flat()});
    });
  }

  render() {
    const {keywords, matched} = this.state;

    const list = keywords.map((keyword, index) => {
      return (
        <li key={index} onKeyDown={this.handleKeyDown} tabIndex={-1}>
          {keyword}
        </li>
      );
    });

    const matchedList = matched.slice(0, 10).map((text, index) => {
      return (
        <li className="list-group-item" key={index}>
          {text}
        </li>
      );
    });

    return (
      <div className="PreferencesMute">
        <form onSubmit={this.handleSubmit}>
          <ul className="entry list-group">
            <li className="list-group-header">
              <input name="keyword" type="text" className="form-control" onChange={this.handleChangeEntry} />
              <label>{matched.length} tweets matched</label>
            </li>
            {matchedList}
          </ul>
        </form>
        <ul className="keywords">{list}</ul>
      </div>
    );
  }
}

Object.defineProperty(Mute, "name", {value: "Mute"});
export default Mute;
