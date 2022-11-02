import * as React from "react";
import {useSelector, useDispatch} from "react-redux";
import {useState, useEffect} from "react";
import {mixPreferences} from "@libraries/screen";
import adapters from "@libraries/adapter";
import {css} from "@emotion/react";
import * as actions from "@actions";

const {facade} = window;

const Screens = () => {
  const [backstages, setBackstages] = useState<TMB.NormalizedBackstage>(useSelector<TMB.State, TMB.NormalizedBackstage>((state) => state.backstages));
  const growlIsRunning = facade.collaborators.growl();

  useEffect(() => {
    (async () => {
      setBackstages(await getLatestBackstages(backstages));
    })();
  }, []);

  const dispatch = useDispatch();
  const save = () => {
    const inputs = document.querySelectorAll("input");

    const map = new Map<string, Partial<TMB.Backstage>>();
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

    let allPreference = backstages;
    submitted.forEach((preference) => {
      allPreference = adapters.backstages.upsertOne(allPreference, preference as TMB.Backstage);
    });

    dispatch(actions.reconfigure(allPreference));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    save();
  };
  const handleFieldSetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fieldset = event.currentTarget.parentNode!.parentNode! as ParentNode & {disabled: boolean};
    fieldset.disabled = !event.currentTarget.checked;

    save();
  };

  const elements = adapters.backstages
    .getSelectors()
    .selectAll(backstages)
    .map((screen) => {
      return (
        <li key={screen.identifier}>
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
    <div css={styles} className="theme">
      <form>
        <ol>{elements}</ol>
      </form>
    </div>
  );
};
export default Screens;

async function getLatestBackstages(current: TMB.NormalizedBackstage): Promise<TMB.NormalizedBackstage> {
  const lists = await facade.agent.lists();

  return mixPreferences(current, lists);
}

const styles = css`
  height: 100%;
  overflow-y: auto;

  legend {
    input {
      margin-right: 8px;
    }
  }
  ol {
    padding: 16px;
    margin: 0;
    list-style-type: none;

    li + li {
      margin-top: 8px;
    }
  }
`;
