import * as React from "react";
import UserIdentifier from "../UserIdentifier";
import ExternalLink from "../ExternalLink";
import {decodeHTML} from "@shared/tools";
import {parseElements} from "@libraries/twitter";

interface Property {
  tweet: Twitter.Tweet;
  expand?: boolean;
  search(event: React.SyntheticEvent): void;
}

const TweetBody: React.SFC<Property> = ({tweet, expand = false, search}) => {
  const elements = parseElements(tweet, expand);

  let fragments: JSX.Element[] = [];
  for (let element of elements) {
    switch (element.type) {
      case "string":
        fragments.push(React.createElement(React.Fragment, {key: fragments.length}, breakLine(decodeHTML(element.entity))));
        break;
      case "hashtags":
        fragments.push(React.createElement("span", {key: fragments.length, className: "hashtag", onClick: search}, `#${decodeHTML(element.entity.text)}`));
        break;
      case "user_mentions":
        fragments.push(<UserIdentifier key={fragments.length} identifier={element.entity.screen_name} />);
        break;
      case "urls":
        fragments.push(<ExternalLink key={fragments.length} link={element.entity.expanded_url} text={element.entity.display_url} />);
        break;
      case "media":
        if (!expand) {
          fragments.push(<ExternalLink key={fragments.length} link={element.entity.media_url_https} text={element.entity.display_url} />);
        }
        break;
    }
  }

  return <React.Fragment>{fragments}</React.Fragment>;
};

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
