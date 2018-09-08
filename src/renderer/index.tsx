import * as React from "react";
import * as ReactDOM from "react-dom";
import {Authorization} from "./Authorization";
import {Principal} from "./Principal";
import {remote} from 'electron';
import 'photon/dist/css/photon.css'
import './index.scss';

const authorization = new Authorization({});
authorization.authorize((twitter: any,screen_name: string) => {
  const browser = remote.getCurrentWindow();
  browser.setTitle(`The Moody Blues (${screen_name})`);

  ReactDOM.render(
    <Principal twitter={twitter}/>,
    document.getElementById("app")
  );
});

