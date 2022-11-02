import {useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {EVERYONE} from "@shared/defaults";
import * as DateUtility from "date-fns";
import * as actions from "@actions";

const Gatekeeper = () => {
  const gatekeeper = useSelector<TMB.State, TMB.GatekeeperPreference>((state) => {
    return state.gatekeeper;
  });
  const [selectedPassenger, setSelectedPassenger] = useState<TMB.PassengerPreference>(gatekeeper.passengers[EVERYONE]);

  const dispatch = useDispatch();
  function handleDelete(keyword: string) {
    dispatch(actions.deleteTaboo({identifier: selectedPassenger.identifier, keyword}));
  }

  const passengerLinks = Object.values(gatekeeper.passengers)
    .sort((a, b) => {
      return a.identifier < b.identifier ? 1 : -1;
    })
    .map((passenger) => {
      const active = selectedPassenger.identifier == passenger.identifier ? "active" : "";
      return (
        <span
          key={passenger.identifier}
          onClick={() => {
            setSelectedPassenger(passenger);
          }}
          className={`nav-group-item ${active}`}
        >
          {passenger.name}
        </span>
      );
    });

  const tabooRows = Object.values(selectedPassenger.taboos).map((taboo) => {
    return (
      <tr key={taboo.keyword}>
        <td>{taboo.keyword}</td>
        <td>{taboo.expireAt ? `${DateUtility.format(new Date(taboo.expireAt), "yyyy-MM-dd HH:mm")}まで` : "無期限"}</td>
        <td
          onClick={() => {
            handleDelete(taboo.keyword);
          }}
        >
          <span className="icon icon-cancel"></span>
        </td>
      </tr>
    );
  });

  return (
    <div className="pane-group theme">
      <div className="pane pane-sm sidebar invert">
        <nav className="nav-group">{passengerLinks}</nav>
      </div>
      <div className="pane">
        <table className="table-striped invert">
          <thead>
            <tr className="active">
              <th>Keyword</th>
              <th style={{width: "180px"}}>Expire At</th>
              <th style={{width: "40px"}}></th>
            </tr>
          </thead>
          <tbody>{tabooRows}</tbody>
        </table>
      </div>
    </div>
  );
};
export default Gatekeeper;
