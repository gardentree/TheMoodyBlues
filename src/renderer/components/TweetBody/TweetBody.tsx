import * as React from "react";
import UserIdentifier from "../UserIdentifier";
import ExternalLink from "../ExternalLink";
import {decodeHTML} from "../../others/tools";
import * as twitter from "../../others/twitter";
import * as actions from "../../actions";

interface TweetElement {
  category: string;
  entity: any;
}

export default class TweetBody extends React.Component<any, any> {
  private elements: TweetElement[];

  constructor(props: {tweet: twitter.Tweet}) {
    super(props);

    this.elements = TweetBody.parseElements(this.props.tweet);

    this.clickHashtag = this.clickHashtag.bind(this);
  }

  clickHashtag(event: React.SyntheticEvent) {
    const target = event.target as HTMLElement;
    this.props.dispatch(actions.searchTweets(target.textContent!));
  }

  render() {
    let fragments: JSX.Element[] = [];
    for (let element of this.elements) {
      const entity = element.entity;
      switch (element.category) {
        case "string":
          fragments.push(React.createElement(React.Fragment, {key: fragments.length}, TweetBody.breakLine(decodeHTML(element.entity))));
          break;
        case "hashtags":
          fragments.push(React.createElement("span", {key: fragments.length, className: "hashtag", onClick: this.clickHashtag}, `#${decodeHTML(entity.text)}`));
          break;
        case "user_mentions":
          fragments.push(<UserIdentifier key={fragments.length} identifier={entity.screen_name} />);
          break;
        case "urls":
          fragments.push(<ExternalLink key={fragments.length} link={entity.expanded_url} text={entity.display_url} />);
          break;
        case "media":
          break;
      }
    }

    return <React.Fragment>{fragments}</React.Fragment>;
  }
  private static parseElements(tweet: twitter.Tweet): TweetElement[] {
    let entities: {category: string; entity: any}[] = [];
    for (let category of ["hashtags", "user_mentions", "urls", "media"]) {
      if (!tweet.entities[category]) continue;

      entities = entities.concat(tweet.entities[category].map((entity: any) => ({category: category, entity: entity})));
    }
    if (entities.length > 0) {
      entities.sort((a, b) => a.entity.indices[0] - b.entity.indices[0]);
    }

    const characters = Array.from(tweet.full_text).slice(tweet.display_text_range[0], tweet.display_text_range[1]);
    let elements = [];
    let start = 0;
    for (let entity of entities) {
      if (start < entity.entity.indices[0]) {
        const element = characters.slice(start, entity.entity.indices[0]).join("");
        elements.push({category: "string", entity: element});
      }
      if (characters.length >= entity.entity.indices[0]) {
        elements.push(entity);
      }

      start = entity.entity.indices[1];
    }
    if (start < characters.length) {
      const element = characters.slice(start, characters.length).join("");
      elements.push({category: "string", entity: element});
    }

    if (tweet.quoted_status_permalink) {
      const last = elements.slice(-1)[0];
      if (last.category === "urls" && last.entity.url === tweet.quoted_status_permalink.url) {
        elements.pop();
      }
    }

    return elements;
  }
  private static breakLine(text: string): JSX.Element[] {
    const elements = text.split(/(?:\r\n|\r|\n)/);

    return elements.map((element, index) => {
      const span = element ? <span>{element}</span> : null;
      const br = elements.length > index + 1 ? <br /> : null;

      return (
        <React.Fragment key={index}>
          {span}
          {br}
        </React.Fragment>
      );
    });
  }
}
