import * as React from "react";
import * as ReactDOM from "react-dom";
import {Authorization} from "./Authorization";
import {Tweet} from "./twitter";
import {Timeline} from "./Timeline";
import * as FileSystem from "fs";
import {ipcRenderer} from 'electron';

const authorization = new Authorization({});

authorization.authorize((twitter) => {
  const dummy = JSON.parse(FileSystem.readFileSync('tweets.json').toString());
  let timeline = React.createRef<Timeline>();

  ipcRenderer.on('reload',(event: string,arugments: any) => {
    twitter.get('statuses/home_timeline',{count: 200,exclude_replies: true,include_entities: true,tweet_mode: 'extended'},(error: string,tweets: Tweet[],response: any) => {
      if (error) throw error;

      timeline.current!.setState({tweets: tweets});
    })
  });

  ReactDOM.render(
    <Timeline ref={timeline} tweets={dummy.slice(0,3)} />,
    document.getElementById("app")
  );
});

