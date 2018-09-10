import * as React from "react";
import {Tweet} from "./tweet";
import * as twitter from "./twitter";

interface Property {
  tweets: twitter.Tweet[];
}

export class TweetList extends React.Component<Property,{focus: string|null,latest: number}> {
  constructor(property: Property) {
    super(property);

    this.state = {focus: null,latest: 0}

    this.setFocus = this.setFocus.bind(this);
    this.scrolling = this.scrolling.bind(this);
  }

  setFocus(event: React.SyntheticEvent<HTMLElement>) {
    this.setState({focus: event.currentTarget.dataset.id!});
  }
  scrolling(event: Event): void {
    if ((event.target as HTMLElement).scrollTop <= 0 && this.props.tweets.length > 0 && this.state.latest < this.props.tweets[0].id) {
      this.setState({latest: this.props.tweets[0].id});
    }
  }

  componentDidMount() {
    window.addEventListener('scroll',this.scrolling,true);
  }

  render() {
    const elements = this.props.tweets.map((tweet) => {
      return (
        <li key={tweet.id_str} data-id={tweet.id_str} className={this.state.focus == tweet.id_str ? 'focus':''} onClick={this.setFocus}>
          <Tweet source={tweet} unread={this.state.latest > 0 && tweet.id > this.state.latest} />
        </li>
      )
    });

    return (
      <ul className="timeline">
        {elements}
      </ul>
    );
  }

  componentDidUpdate() {
    if (this.state.latest <= 0 && this.props.tweets.length > 0) {
      this.setState({latest: this.props.tweets[0].id});
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll',this.scrolling);
  }
}
