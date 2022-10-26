import * as React from "react";
import {useState, useEffect} from "react";
import {mixPreferences} from "@libraries/screen";

const {facade} = window;
const growlIsRunning = facade.collaborators.growl();

async function getCurrentPreferences() {
  const lists = await facade.agent.lists();
  const current = await facade.storage.getScreenPreferences();

  return mixPreferences(current, lists);
}

async function save() {
  const inputs = document.querySelectorAll("input");

  const map = new Map();
  for (const input of inputs) {
    const matcher = /([^\[]+)\[([^\]]+)\]/.exec(input.name);
    if (!matcher) {
      continue;
    }

    const [, identifier, key] = matcher;
    let preference = map.get(identifier);
    if (!preference) {
      preference = {};
      map.set(identifier, preference);
    }

    let value: string | number | boolean;
    switch (input.type) {
      case "checkbox":
        value = input.checked || false;
        break;
      case "number":
        value = Number(input.value);
        break;
      default:
        value = input.value;
    }
    preference[key] = value;
  }
  const submitted = Array.from(map).map(([identifier, preference]) => {
    preference.identifier = identifier;

    return preference;
  });

  const currents = await getCurrentPreferences();
  const newPreferences = submitted.map((preference) => {
    const current = currents.find((entry) => entry.identifier == preference.identifier);
    return Object.assign({}, current, preference);
  });

  facade.storage.setScreenPreferences(newPreferences);
}

const Screens = () => {
  const [screens, setScreens] = useState<TMB.ScreenPreference[]>([]);
  useEffect(() => {
    (async () => {
      setScreens(await getCurrentPreferences());
    })();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    save();
  };

  const handleFieldSetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fieldset = event.currentTarget.parentNode!.parentNode! as ParentNode & {disabled: boolean};
    fieldset.disabled = !event.currentTarget.checked;

    save();
  };

  const elements = screens.map((screen, index) => {
    return (
      <li key={index}>
        <fieldset disabled={!screen.active}>
          <legend>
            <input name={`${screen.identifier}[active]`} type="checkbox" defaultChecked={screen.active} onChange={handleFieldSetChange} />
            {screen.title}
          </legend>

          <div className="checkbox">
            <label>
              <input name={`${screen.identifier}[mute]`} type="checkbox" defaultChecked={screen.mute} onChange={handleChange} />
              Mute
            </label>
          </div>
          <div className="checkbox">
            <label>
              <input disabled={!growlIsRunning} name={`${screen.identifier}[growl]`} type="checkbox" defaultChecked={growlIsRunning && screen.growl} onChange={handleChange} />
              Growl
            </label>
          </div>
          <div className="form-group">
            <label>Interval</label>
            <input name={`${screen.identifier}[interval]`} type="number" className="form-control" defaultValue={screen.interval} min="60" max="300" step="60" onChange={handleChange} />
          </div>
        </fieldset>
      </li>
    );
  });

  return (
    <div className="PreferencesScreens">
      <form>
        <ol>{elements}</ol>
      </form>
    </div>
  );
};
export default Screens;
