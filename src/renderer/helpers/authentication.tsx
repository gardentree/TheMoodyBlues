import {shell} from "electron";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {OAuth} from "oauth";
import {setup} from "../helpers/twitter";

const ElectronStore = require("electron-store");
const store = new ElectronStore();

const oauth = new OAuth("https://api.twitter.com/oauth/request_token", "https://api.twitter.com/oauth/access_token", process.env.CONSUMER_KEY!, process.env.CONSUMER_SECRET!, "1.0A", null, "HMAC-SHA1");

function loadClient(): any | null {
  const accessKey = store.get("access_token_key");
  const accessSecret = store.get("access_token_secret");

  if (accessKey === void 0 || accessSecret === void 0) {
    return null;
  }

  return createClient({key: accessKey, secret: accessSecret});
}

interface Token {
  key: string;
  secret: string;
}

function createClient(accessToken: Token): any {
  const Twitter = require("twitter");
  return setup(
    new Twitter({
      consumer_key: process.env.CONSUMER_KEY,
      consumer_secret: process.env.CONSUMER_SECRET!,
      access_token_key: accessToken.key,
      access_token_secret: accessToken.secret,
    })
  );
}

function getRequestToken() {
  return new Promise<Token>((resolve, reject) => {
    oauth.getOAuthRequestToken((error: any, key: string, secret: string, results: any) => {
      if (error) reject(error);

      resolve({key: key, secret: secret});
    });
  });
}
function getAccessToken(requestToken: Token, verifier: string) {
  return new Promise<Token>((resolve, reject) => {
    oauth.getOAuthAccessToken(requestToken.key, requestToken.secret, verifier, (error: any, accessKey: string, accessSecret: string) => {
      if (error) reject(error);

      resolve({key: accessKey, secret: accessSecret});
    });
  });
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

export default async function authorize() {
  const client = loadClient();
  if (client) return client;

  const requestToken = await getRequestToken();
  shell.openExternal(`https://api.twitter.com/oauth/authorize?oauth_token=${requestToken.key}`);
  const verifier = await getVerifier();
  const accessToken = await getAccessToken(requestToken, verifier);

  store.set("access_token_key", accessToken.key);
  store.set("access_token_secret", accessToken.secret);

  return createClient(accessToken);
}
