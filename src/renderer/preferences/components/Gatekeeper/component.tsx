import * as React from "react";
import {useState, useEffect} from "react";
import {GATEKEEPER, EVERYONE} from "@shared/defaults";
import * as DateUtility from "date-fns";
import lodash from "lodash";

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

  function handleDelete(keyword: string) {
    const newGatekeeper = lodash.cloneDeep(gatekeeper);
    const newPassenger = newGatekeeper.passengers[currentPassenger.identifier];
    delete newPassenger.taboos[keyword];

    facade.storage.setGatekeeperPreference(newGatekeeper);
    setGatekeeper(newGatekeeper);
    setCurrentPassenger(newPassenger);
  }

  const tabooRows = Object.values(currentPassenger.taboos).map((taboo) => {
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
    <div className="pane-group">
      <div className="pane pane-sm sidebar">
        <nav className="nav-group">{passengerLinks}</nav>
      </div>
      <div className="pane">
        <table className="table-striped">
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
