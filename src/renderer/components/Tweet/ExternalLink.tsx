import {css} from "@emotion/react";

interface OwnProps {
  link: string;
  text: string;
}

const {facade} = window;

const openLinkOnAnchor = function (event: React.MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
  facade.actions.openExternal(event.currentTarget.href);
};

const ExternalLink = (props: OwnProps) => {
  const {link, text} = props;

  return (
    <a css={styles} href={link} onClick={openLinkOnAnchor}>
      {text}
    </a>
  );
};
export default ExternalLink;

const styles = css({
  cursor: "pointer",
});
