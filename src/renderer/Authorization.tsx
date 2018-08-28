import * as React from "react";
import * as ReactDOM from "react-dom";
import {OAuth} from 'oauth';
import {shell} from "electron";

interface Form extends HTMLFormElement {
  pin: HTMLInputElement;
}

export class Authorization extends React.Component<{},{}> {
  constructor(props: {}) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event: React.SyntheticEvent): void {
    event.preventDefault();

    const form: Form = event.target as Form;
    this.setupAccessToken(form.pin.value);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Pin Code:
          <input type='text' name='pin' />
        </label>
        <input type='submit' value='Submit' />
      </form>
    )
  }

  private setupAccessToken(oauthVerifier: string): void {
    throw new Error();
  }

  public authorize(callback: (twitter: any) => void) {
    const ElectronStore = require('electron-store');
    const store = new ElectronStore();

    const accessTokenKey = store.get('access_token_key');
    const accessTokenSecret = store.get('access_token_secret');

    const back = (accessTokenKey: string,accessTokenSecret: string) => {
      const Twitter = require('twitter');
      const twitter = new Twitter({
        consumer_key:        process.env.CONSUMER_KEY,
        consumer_secret:     process.env.CONSUMER_SECRET!,
        access_token_key:    accessTokenKey,
        access_token_secret: accessTokenSecret
      })
      twitter.get('account/verify_credentials',{},(error: any,json: any,response: any) => {
        console.log(json);
        callback(twitter);
      });
    }

    if (accessTokenKey === void 0 || accessTokenSecret === void 0) {
      const oauth = new OAuth(
        "https://api.twitter.com/oauth/request_token",
        "https://api.twitter.com/oauth/access_token",
        process.env.CONSUMER_KEY!,
        process.env.CONSUMER_SECRET!,
        "1.0A",
        null,
        "HMAC-SHA1"
      );

      oauth.getOAuthRequestToken((error,oauthToken,oauthTokenSecret,results) => {
        if (error) return;
        const authUrl = `https://api.twitter.com/oauth/authorize?oauth_token=${oauthToken}`;
        shell.openExternal(authUrl);

        ReactDOM.render(
          this.render(),
          document.getElementById("app")
        );

        this.setupAccessToken = (oauthVerifier) => {
          oauth.getOAuthAccessToken(oauthToken,oauthTokenSecret,oauthVerifier,(error,accessTokenKey,accessTokenSecret) => {
            store.set('access_token_key',   accessTokenKey);
            store.set('access_token_secret',accessTokenSecret);

            back(accessTokenKey,accessTokenSecret);
          });
        };
      });
    }
    else {
      back(accessTokenKey,accessTokenSecret);
    }
  }
}
