import * as React from "react";
import * as storage from "../../helpers/storage";

interface Form extends HTMLFormElement {
  keyword: HTMLInputElement;
}

class Mute extends React.Component<{}, {keywords: string[]}> {
  state = {keywords: storage.getMuteKeywords()};

  handleSubmit = (event: React.SyntheticEvent<Form>) => {
    event.preventDefault();

    const keyword = event.currentTarget.keyword.value.toLowerCase();
    this.state.keywords.push(keyword);
    this.state.keywords.sort();
    this.state.keywords = [...new Set(this.state.keywords)];

    storage.setMuteKeywords(this.state.keywords);

    event.currentTarget.keyword.value = "";
    this.setState({keywords: this.state.keywords});
  };

  handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.keyCode == 8) {
      const keyword = event.currentTarget.textContent!;
      const index = this.state.keywords.indexOf(keyword);
      this.state.keywords.splice(index, 1);

      storage.setMuteKeywords(this.state.keywords);
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

Object.defineProperty(Mute, "name", {value: "Mute"});
export default Mute;
