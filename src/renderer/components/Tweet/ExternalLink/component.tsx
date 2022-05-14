import React from "react";

export interface OwnProps {
  link: string;
  text: string;
}

type Props = OwnProps;

const {facade} = window;

const openLinkOnAnchor = function (event: React.MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
  facade.actions.openExternal(event.currentTarget.href);
};

const ExternalLink = (props: Props) => {
  const {link, text} = props;

  return (
    <a className="ExternalLink" href={link} onClick={openLinkOnAnchor}>
      {text}
    </a>
  );
};

export default ExternalLink;
