import * as React from "react";
import * as ReactDOM from "react-dom";
import {createStore, applyMiddleware} from "redux";
import createSagaMiddleware from "redux-saga";
import rootReducer from "./modules/reducer";
import rootSaga from "./sagas";
import {Provider} from "react-redux";
import Principal from "./components/Principal";
import {createLogger} from "redux-logger";

const {TheMoodyBlues} = window;

export default function launch() {
  (async () => {
    const agent = await new Promise<TwitterAgent>((resolve, reject) => {
      resolve(TheMoodyBlues.authorize(getVerifier));
    });

    setup(agent);
  })();
}

function setup(agent: TwitterAgent) {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(rootReducer, applyMiddleware(sagaMiddleware, createLogger()));

  sagaMiddleware.run(rootSaga);

  TheMoodyBlues.keybinds(store);
  store.getState()["agent"] = agent;
  store.getState()["home"]["timelines"] = loadTimelines();

  ReactDOM.render(
    <Provider store={store}>
      <Principal />
    </Provider>,
    document.getElementById("app")
  );
}

function getVerifier() {
  return new Promise<string>((resolve, reject) => {
    const callback = (verifier: string) => {
      resolve(verifier);
    };
    ReactDOM.render(<VerifierForm callback={callback} />, document.getElementById("app"));
  });
}

interface Form extends HTMLFormElement {
  pin: HTMLInputElement;
}
class VerifierForm extends React.Component<any, any> {
  constructor(props: {callback: string}) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event: React.SyntheticEvent): void {
    event.preventDefault();

    const form: Form = event.target as Form;
    this.props.callback(form.pin.value);
  }

  render() {
    return (
      <div className="window">
        <header className="toolbar toolbar-header">
          <h1 className="title">The Moody Blues</h1>
        </header>
        <form onSubmit={this.handleSubmit}>
          <label>
            Pin Code:
            <input type="text" name="pin" />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

function loadTimelines() {
  const timelines = new Map();

  for (const preference of TheMoodyBlues.storage.getTimelinePreferences()) {
    timelines.set(preference.identity, {
      preference: preference,
      tweets: [],
      state: {
        lastReadID: 0,
      },
    });
  }

  return timelines;
}
