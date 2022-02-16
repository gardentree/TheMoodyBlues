import * as React from "react";
import {useState, useEffect} from "react";
import {mixPreferences} from "@libraries/timeline";

const {facade} = window;

async function getCurrentPreferences() {
  const lists = await facade.agent.lists();
  const current = await facade.storage.getTimelinePreferences();

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

    const [, identity, key] = matcher;
    let preference = map.get(identity);
    if (!preference) {
      preference = {};
      map.set(identity, preference);
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
  const submitted = Array.from(map).map(([identity, preference]) => {
    preference.identity = identity;

    return preference;
  });

  const currents = await getCurrentPreferences();
  const newPreferences = submitted.map((preference) => {
    const current = currents.find((entry) => entry.identity == preference.identity);
    return Object.assign({}, current, preference);
  });

  facade.storage.setTimelinePreferences(newPreferences);
}

const Timelines = () => {
  const [timelines, setTimelines] = useState<TheMoodyBlues.TimelinePreference[]>([]);
  useEffect(() => {
    (async () => {
      setTimelines(await getCurrentPreferences());
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

  const elements = timelines.map((timeline, index) => {
    return (
      <li key={index}>
        <fieldset disabled={!timeline.active}>
          <legend>
            <input name={`${timeline.identity}[active]`} type="checkbox" defaultChecked={timeline.active} onChange={handleFieldSetChange} />
            {timeline.title}
          </legend>

          <div className="checkbox">
            <label>
              <input name={`${timeline.identity}[mute]`} type="checkbox" defaultChecked={timeline.mute} onChange={handleChange} />
              Mute
            </label>
          </div>
          <div className="checkbox">
            <label>
              <input name={`${timeline.identity}[growl]`} type="checkbox" defaultChecked={timeline.growl} onChange={handleChange} />
              Growl
            </label>
          </div>
          <div className="form-group">
            <label>Interval</label>
            <input name={`${timeline.identity}[interval]`} type="number" className="form-control" defaultValue={timeline.interval} min="60" max="300" step="60" onChange={handleChange} />
          </div>
        </fieldset>
      </li>
    );
  });

  return (
    <div className="PreferencesTimelines">
      <form>
        <ol>{elements}</ol>
      </form>
    </div>
  );
};
export default Timelines;
