import {useSelector} from "react-redux";
import adapters from "@libraries/adapter";

const StatusBar = () => {
  const {status} = useSelector<TMB.State, TMB.ScreenStatus>((state) => {
    const {screens, principal} = state;
    const screen = adapters.screens.getSelectors().selectById(screens, principal.focused);

    if (screen) {
      return screen.status;
    } else {
      return {
        status: "loading",
      };
    }
  });

  return (
    <div className="StatusBar">
      <h1 className="title">{status}</h1>
    </div>
  );
};
export default StatusBar;
