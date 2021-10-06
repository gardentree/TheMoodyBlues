import * as React from "react";
import UserIdentifier from "../UserIdentifier";
import ExternalLink from "../ExternalLink";
import {decodeHTML} from "../../../helpers/tools";

interface Property {
  tweet: TweetType;
  expand?: boolean;
  search: any;
}
interface TweetElement {
  category: string;
  entity: any;
}

const TweetBody: React.SFC<Property> = ({tweet, expand = false, search}) => {
  const elements = parseElements(tweet, expand);

  let fragments: JSX.Element[] = [];
  for (let element of elements) {
    const entity = element.entity;
    switch (element.category) {
      case "string":
        fragments.push(React.createElement(React.Fragment, {key: fragments.length}, breakLine(decodeHTML(element.entity))));
        break;
      case "hashtags":
        fragments.push(React.createElement("span", {key: fragments.length, className: "hashtag", onClick: search}, `#${decodeHTML(entity.text)}`));
        break;
      case "user_mentions":
        fragments.push(<UserIdentifier key={fragments.length} identifier={entity.screen_name} />);
        break;
      case "urls":
        fragments.push(<ExternalLink key={fragments.length} link={entity.expanded_url} text={entity.display_url} />);
        break;
      case "media":
        if (!expand) {
          fragments.push(<ExternalLink key={fragments.length} link={entity.media_url_https} text={entity.display_url} />);
        }
        break;
    }
  }

  return <React.Fragment>{fragments}</React.Fragment>;
};

function parseElements(tweet: TweetType, expand: boolean): TweetElement[] {
  let entities: {category: string; entity: any}[] = [];
  for (let category of ["hashtags", "user_mentions", "urls", "media"]) {
    if (!tweet.entities[category]) continue;

    entities = entities.concat(tweet.entities[category].map((entity: any) => ({category: category, entity: entity})));
  }
  if (entities.length > 0) {
    entities.sort((a, b) => a.entity.indices[0] - b.entity.indices[0]);
  }

  const characters = Array.from(tweet.full_text);
  let elements = [];
  let start = 0;
  for (let entity of entities) {
    if (start < entity.entity.indices[0]) {
      const element = characters.slice(start, entity.entity.indices[0]).join("");
      elements.push({category: "string", entity: element});
    }
    if (tweet.display_text_range[1] >= entity.entity.indices[0]) {
      elements.push(entity);
    }

    start = entity.entity.indices[1];
  }
  if (start < characters.length) {
    const element = characters.slice(start, characters.length).join("");
    elements.push({category: "string", entity: element});
  }

  if (expand && tweet.quoted_status_permalink) {
    const last = elements.slice(-1)[0];
    if (last.category === "urls" && last.entity.url === tweet.quoted_status_permalink.url) {
      elements.pop();
    }
  }

  return elements;
}
function breakLine(text: string): JSX.Element[] {
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

export default TweetBody;
