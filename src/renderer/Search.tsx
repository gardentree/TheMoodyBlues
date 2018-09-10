import * as React from "react";
import {TweetList} from "./TweetList";
import * as twitter from "./twitter";

interface Property {
  twitter: any;
}
interface Form extends HTMLFormElement {
  query: HTMLInputElement;
}

export class Search extends React.Component<Property,{tweets: twitter.Tweet[],query: string}> {
  private timer: any|null;

  constructor(property: Property) {
    super(property)

    this.state = {tweets: [],query: ''};

    this.timer = null
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event: React.SyntheticEvent): void {
    event.preventDefault();

    const form: Form = event.target as Form;
    this.search(form.query.value);
  }

  render() {
    return (
      <div>
        <div className='toolbar'>
          <form className='search' onSubmit={this.handleSubmit}>
            <input className='form-control' type='search' name='query' value={this.state.query} onChange={event => this.setState({query: event.target.value})} />
          </form>
        </div>
        <div>
          <TweetList tweets={this.state.tweets} />
        </div>
      </div>
    )
  }

  public search(query: string) {
    this.setState({tweets: [],query: query});
    this.reorder(query,false);
  }

  public reload() {
    this.reorder(this.state.query,true);
  }
  public forceReload() {
    this.reload();
  }
  private reorder(query: string,addition: boolean) {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (query.length <= 0) return;

    let option = {
      q: `${query} -rt`,
      count: 100,
      include_entities: true,
      tweet_mode: 'extended'
    }
    if (addition && this.state.tweets.length > 0) {
      option['since_id'] = this.state.tweets[0].id_str
    }

    this.props.twitter.get('search/tweets',option,(error: string,tweets: twitter.Tweet[],response: any) => {
      tweets = tweets['statuses'];
      if (error) throw error;

      if (tweets.length > 0) {
        const all = tweets.concat(this.state.tweets);
        this.setState({tweets: all});
      }

      this.timer = setTimeout(() => {
        this.reorder(query,true);
      },60 * 1000);
    })
  }
}
