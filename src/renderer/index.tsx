import * as React from "react";
import * as ReactDOM from "react-dom";
import {Authorization} from "./Authorization";
import {Tweet} from "./twitter";
import {Timeline} from "./Timeline";
import {ipcRenderer} from 'electron';

const authorization = new Authorization({});

authorization.authorize((twitter) => {
  let timeline = React.createRef<Timeline>();

  const storage = require("electron-json-storage");

  ipcRenderer.on('reload',(event: string,arugments: any) => {
    twitter.get('statuses/home_timeline',{count: 200,exclude_replies: true,include_entities: true,tweet_mode: 'extended'},(error: string,tweets: Tweet[],response: any) => {
      if (error) throw error;

      timeline.current!.setState({tweets: tweets});
    })
  });
  ipcRenderer.on('closed',(event: string,arugments: any) => {
    storage.set('tweets',timeline.current!.state.tweets,(error: string) => {
      if (error) throw error;
    })
  });

  storage.get('tweets', function(error: string,tweets: Tweet[]) {
    if (error) throw error;

    ReactDOM.render(
      <Timeline ref={timeline} tweets={tweets} />,
      document.getElementById("app")
    );
  });
});

