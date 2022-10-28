import * as React from "react";
import {useState, useEffect} from "react";
import {GATEKEEPER, EVERYONE} from "@shared/defaults";
import * as DateUtility from "date-fns";

const {facade} = window;

const Gatekeeper = () => {
  const [gatekeeper, setGatekeeper] = useState<TMB.GatekeeperPreference>(GATEKEEPER);
  const [currentPassenger, setCurrentPassenger] = useState<TMB.PassengerPreference>(gatekeeper.passengers[EVERYONE]);

  useEffect(() => {
    (async () => {
      const gatekeeper = await facade.storage.getGatekeeperPreference();
      setGatekeeper(gatekeeper);
      setCurrentPassenger(gatekeeper.passengers[EVERYONE]);
    })();
  }, []);

  const passengerLinks = Object.values(gatekeeper.passengers)
    .sort((a, b) => {
      return a.identifier < b.identifier ? 1 : -1;
    })
    .map((passenger) => {
      const active = currentPassenger.identifier == passenger.identifier ? "active" : "";
      return (
        <span
          key={passenger.identifier}
          onClick={() => {
            setCurrentPassenger(passenger);
          }}
          className={`nav-group-item ${active}`}
        >
          {passenger.name}
        </span>
      );
    });

  const tabooRows = Object.values(currentPassenger.taboos).map((taboo) => {
    return (
      <tr key={taboo.keyword}>
        <td>{taboo.keyword}</td>
        <td>{`${DateUtility.format(new Date(taboo.expireAt), "yyyy-MM-dd HH:mm")}まで`}</td>
      </tr>
    );
  });

  return (
    <div className="pane-group">
      <div className="pane pane-sm sidebar">
        <nav className="nav-group">{passengerLinks}</nav>
      </div>
      <div className="pane">
        <table className="table-striped">
          <thead>
            <tr>
              <th>Keyword</th>
              <th>Expire At</th>
            </tr>
          </thead>
          <tbody>{tabooRows}</tbody>
        </table>
      </div>
    </div>
  );
};
export default Gatekeeper;
