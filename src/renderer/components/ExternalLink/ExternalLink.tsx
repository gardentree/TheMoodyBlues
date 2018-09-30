import * as React from "react";
import "./ExternalLink.scss";
import {openLinkOnAnchor} from "../../others/tools";

interface Property {
  link: string;
}

const ExternalLink: React.SFC<Property> = ({link}) => {
  return (
    <a className="ExternalLink" href={link} onClick={openLinkOnAnchor}>
      {link}
    </a>
  );
};

export default ExternalLink;
