import * as React from "react";
import {openLinkOnAnchor,decodeHTML} from "../others/tools";
import * as twitter from "../others/twitter";

import {connect} from 'react-redux'
import * as actions from '../actions'

interface TweetElement {
  category: string
  entity: any
}

class PrettyTweet extends React.Component<any,any> {
  private elements: TweetElement[]

  constructor(props: {tweet: twitter.Tweet}) {
    super(props);

    this.elements = PrettyTweet.parseElements(this.props.tweet)

    this.clickHashtag = this.clickHashtag.bind(this);
  }

  clickHashtag(event: React.SyntheticEvent) {
    const target = event.target as HTMLElement;
    this.props.dispatch(actions.searchTweets(target.textContent!));
  }

  render() {
    let fragments: JSX.Element[] = []
    for (let element of this.elements) {
      const entity = element.entity
      switch (element.category) {
        case 'string':
          fragments.push(React.createElement(
            React.Fragment,
            {key: fragments.length},
            PrettyTweet.breakLine(decodeHTML(element.entity))
          ));
          break;
        case 'hashtags':
          fragments.push(React.createElement(
            'span',
            {key: fragments.length,className: 'hashtag',onClick: this.clickHashtag},
            `#${decodeHTML(entity.text)}`
          ));
          break;
        case 'user_mentions':
          fragments.push(React.createElement(
            'span',
            {key: fragments.length,className: 'mention'},
            `@${decodeHTML(entity.screen_name)}`
          ));
          break;
        case 'urls':
          fragments.push(React.createElement(
            "a",
            {key: fragments.length,href: entity.expanded_url,onClick: openLinkOnAnchor},
            decodeHTML(entity.display_url)
          ))
          break;
        case 'media':
          break;
      }
    }

    return (
      <React.Fragment>{fragments}</React.Fragment>
    )
  }
  private static parseElements(tweet: twitter.Tweet): TweetElement[] {
    let entities: {category: string,entity: any}[] = []
    for (let category of ['hashtags','user_mentions','urls','media']) {
      if (!tweet.entities[category]) continue;

      entities = entities.concat(tweet.entities[category].map((entity: any) => ({category: category,entity: entity})))
    }
    if (entities.length > 0) {
      entities.sort((a,b) => a.entity.indices[0] - b.entity.indices[0]);
    }

    const characters = Array.from(tweet.full_text)
    let elements = []
    let start = 0
    for (let entity of entities) {
      if (start < entity.entity.indices[0]) {
        const element = characters.slice(start,entity.entity.indices[0]).join('')
        elements.push({category: 'string',entity: element})
      }
      elements.push(entity)

      start = entity.entity.indices[1]
    }
    if (start < characters.length) {
      const element = characters.slice(start,characters.length).join('')
      elements.push({category: 'string',entity: element})
    }

    return elements
  }
  private static breakLine(text: string): JSX.Element[] {
    const elements = text.split(/(?:\r\n|\r|\n)/)

    return (
      elements.map((element,index) => {
        const span = (element) ? (<span>{element}</span>):null;
        const br = (elements.length > (index + 1)) ? (<br/>):null;

        return (<React.Fragment key={index}>{span}{br}</React.Fragment>)
      })
    )
  }
}

export default connect()(PrettyTweet);
