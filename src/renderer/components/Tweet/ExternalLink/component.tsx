import * as React from "react";

interface Property {
  link: string;
  text: string;
}

const {facade} = window;

const openLinkOnAnchor = function (event: React.MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
  facade.actions.openExternal(event.currentTarget.href);
};

const ExternalLink: React.SFC<Property> = ({link, text}) => {
  return (
    <a className="ExternalLink" href={link} onClick={openLinkOnAnchor}>
      {text}
    </a>
  );
};

export default ExternalLink;
