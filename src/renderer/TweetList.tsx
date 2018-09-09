import * as React from "react";
import {Tweet} from "./tweet";
import * as twitter from "./twitter";

interface Property {
  tweets: twitter.Tweet[];
}

export class TweetList extends React.Component<Property,{}> {
  constructor(property: Property) {
    super(property);
  }

  render() {
    const elements = this.props.tweets.map((tweet) => {
      return (
        <li key={tweet.id_str}><Tweet source={tweet} /></li>
      )
    });

    return (
      <ul className="timeline">
        {elements}
      </ul>
    );
  }
}
