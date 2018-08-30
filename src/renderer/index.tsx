import * as React from "react";
import * as ReactDOM from "react-dom";
import {Authorization} from "./Authorization";
import {Tweet} from "./twitter";
import {Timeline} from "./Timeline";
import {ipcRenderer} from 'electron';

const authorization = new Authorization({});

authorization.authorize((twitter) => {
  let timeline: Timeline|null;

  const storage = require("electron-json-storage");

  ipcRenderer.on('reload',(event: string,arugments: any) => {
    let option = {
      count: 200,
      exclude_replies: true,
      include_entities: true,
      tweet_mode: 'extended'
    }
    if (timeline!.state.tweets.length > 0) {
      option['since_id'] = timeline!.state.tweets[0].id_str
    }

    twitter.get('statuses/home_timeline',option,(error: string,tweets: Tweet[],response: any) => {
      if (error) throw error;
      console.log(`${tweets.length} tweets`)

      const all = tweets.concat(timeline!.state.tweets);
      timeline!.setState({tweets: all});
    })
  });
  ipcRenderer.on('closed',(event: string,arugments: any) => {
    storage.set('tweets',timeline!.state.tweets,(error: string) => {
      if (error) throw error;
    })
  });

  storage.get('tweets', function(error: string,tweets: Tweet[]) {
    if (error) throw error;

    ReactDOM.render(
      <Timeline ref={(reference) => {timeline = reference}} tweets={tweets} />,
      document.getElementById("app")
    );
  });
});

