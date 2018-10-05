import * as React from "react";
import "./Mute.scss";
import * as preferences from "../../helpers/preferences";

interface Form extends HTMLFormElement {
  keyword: HTMLInputElement;
}

class Mute extends React.Component<{}, {keywords: string[]}> {
  state = {keywords: preferences.getMuteKeywords()};

  handleSubmit = (event: React.SyntheticEvent<Form>) => {
    event.preventDefault();

    const keyword = event.currentTarget.keyword.value;
    this.state.keywords.push(keyword);
    this.state.keywords.sort();

    preferences.setMuteKeywords(this.state.keywords);

    event.currentTarget.keyword.value = "";
    this.setState({keywords: this.state.keywords});
  };

  handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.keyCode == 8) {
      const keyword = event.currentTarget.textContent!;
      const index = this.state.keywords.indexOf(keyword);
      this.state.keywords.splice(index, 1);

      preferences.setMuteKeywords(this.state.keywords);
      this.setState({keywords: this.state.keywords});
    }
  };

  render() {
    const {keywords} = this.state;

    const list = keywords.map((keyword, index) => {
      return (
        <li key={index} onKeyDown={this.handleKeyDown} tabIndex={-1}>
          {keyword}
        </li>
      );
    });

    return (
      <div className="PreferencesMute">
        <form onSubmit={this.handleSubmit}>
          <input name="keyword" type="text" className="form-control" />
        </form>
        <ul>{list}</ul>
      </div>
    );
  }
}

export default Mute;
