import {useDispatch} from "react-redux";
import * as actions from "@actions";
import {css} from "@emotion/react";

interface OwnProps {
  identifier: Twitter.ScreenName;
}

const UserIdentifier = (props: OwnProps) => {
  const {identifier} = props;

  const dispatch = useDispatch();
  function showUserTimeline(event: React.SyntheticEvent) {
    const target = event.target as HTMLElement;
    dispatch(actions.displayUserTimeline(target.textContent!));
  }

  return (
    <span css={styles} onClick={showUserTimeline}>
      @{identifier}
    </span>
  );
};
export default UserIdentifier;

const styles = css({
  cursor: "pointer",
});
