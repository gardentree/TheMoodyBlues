import * as React from "react";
import {Tweet} from "./tweet";
import * as twitter from "./twitter";

interface Property {
  tweets: twitter.Tweet[];
}

export class TweetList extends React.Component<Property,{focus: string|null}> {
  constructor(property: Property) {
    super(property);

    this.state = {focus: null}

    this.setFocus = this.setFocus.bind(this);
  }

  setFocus(event: React.SyntheticEvent<HTMLElement>) {
    this.setState({focus: event.currentTarget.dataset.id!});
  }

  render() {
    const elements = this.props.tweets.map((tweet) => {
      return (
        <li key={tweet.id_str} data-id={tweet.id_str} className={this.state.focus == tweet.id_str ? 'focus':''} onClick={this.setFocus}><Tweet source={tweet} /></li>
      )
    });

    return (
      <ul className="timeline">
        {elements}
      </ul>
    );
  }
}
