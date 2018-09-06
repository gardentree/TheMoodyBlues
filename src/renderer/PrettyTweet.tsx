import * as React from "react";
import {Tweet} from "./twitter";
import {openLinkOnAnchor} from "./tools"

export class PrettyTweet extends React.Component<{tweet: Tweet},{tweet: Tweet}> {
  constructor(props: {tweet: Tweet}) {
    super(props);
    this.state = {tweet: props.tweet};
  }
  render() {
    const tweet = this.state.tweet

    let text = Array.from(tweet.full_text).slice(tweet.display_text_range[0],tweet.display_text_range[1]).join('');
    let fragments: JSX.Element[] = []
    for (let property of tweet.entities.urls) {
      const elements = text.split(property.url)
      fragments.push(React.createElement(React.Fragment,{key: fragments.length},this.breakLine(elements[0])))
      fragments.push(React.createElement("a",{key: fragments.length,href: property.expanded_url,onClick: openLinkOnAnchor},property.display_url))

      text = elements[1]
    }
    if (text !== undefined) {
      fragments.push(React.createElement(React.Fragment,{key: fragments.length},this.breakLine(text)))
    }

    return (
      <React.Fragment>{fragments}</React.Fragment>
    )
  }
  private breakLine(text: string) {
    const elements = text.split(/(?:\r\n|\r|\n)/)

    return (
      elements.map((element,index) => {
        const span = (element) ? (<span dangerouslySetInnerHTML={{__html: element}} />):null;
        const br = (elements.length > (index + 1)) ? (<br/>):null;

        return (<React.Fragment key={index}>{span}{br}</React.Fragment>)
      })
    )
  }
}
