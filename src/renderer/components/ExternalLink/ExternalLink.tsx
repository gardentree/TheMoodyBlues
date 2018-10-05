import * as React from "react";
import {openLinkOnAnchor} from "../../others/tools";

interface Property {
  link: string;
  text: string;
}

const ExternalLink: React.SFC<Property> = ({link, text}) => {
  return (
    <a className="ExternalLink" href={link} onClick={openLinkOnAnchor}>
      {text}
    </a>
  );
};

export default ExternalLink;
