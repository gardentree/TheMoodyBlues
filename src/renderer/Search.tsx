import * as React from "react";
import {TweetList} from "./TweetList";
import {Tweet} from "./twitter";

interface Property {
  twitter: any;
}
interface Form extends HTMLFormElement {
  query: HTMLInputElement;
}

export class Search extends React.Component<Property,{tweets: Tweet[]}> {
  private query: string|null
  private timer: any|null;

  constructor(property: Property) {
    super(property)

    this.state = {tweets: []};

    this.timer = null
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event: React.SyntheticEvent): void {
    event.preventDefault();

    const form: Form = event.target as Form;
    this.query = form.query.value;

    this.setState({tweets: []});
    this.reorder();
  }

  render() {
    return (
      <div>
        <div className='toolbar'>
          <form className='search' onSubmit={this.handleSubmit}>
            <input className='form-control' type='search' name='query' />
          </form>
        </div>
        <div>
          <TweetList tweets={this.state.tweets} />
        </div>
      </div>
    )
  }

  public search(query: string) {
    this.query = query;

    this.setState({tweets: []});
    this.reorder();
  }

  public reload() {
    this.reorder();
  }
  private reorder() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.query == null||this.query.length <= 0) return;

    let option = {
      q: `${this.query} -rt`,
      count: 100,
      include_entities: true,
      tweet_mode: 'extended'
    }
    if (this.state.tweets.length > 0) {
      option['since_id'] = this.state.tweets[0].id_str
    }

    this.props.twitter.get('search/tweets',option,(error: string,tweets: Tweet[],response: any) => {
      tweets = tweets['statuses'];
      if (error) throw error;

      if (tweets.length > 0) {
        const all = tweets.concat(this.state.tweets);
        this.setState({tweets: all});
      }

      this.timer = setTimeout(() => {
        this.reorder();
      },60 * 1000);
    })
  }
}
