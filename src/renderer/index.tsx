import * as React from "react";
import * as ReactDOM from "react-dom";
import {Authorization} from "./Authorization";
import {Tweet} from "./twitter";
import {Timeline} from "./Timeline";
import {ipcRenderer,remote} from 'electron';

const changeFontSize = (offset: number) => {
  const size = window.getComputedStyle(document.body).fontSize;if (size === null) throw "font size is null";
  const matcher = size.match(/(\d+)px/);if (matcher === null) throw size;

  document.body.style.fontSize = `${Number(matcher[1]) + offset}px`;
};

const authorization = new Authorization({});
authorization.authorize((twitter: any,screen_name: string) => {
  const browser = remote.getCurrentWindow();
  browser.setTitle(`The Moody Blues (${screen_name})`);

  let timeline: Timeline|null;

  const storage = require("electron-json-storage");

  const reload = (event: string,arugments: any) => {
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
  };

  ipcRenderer.on('reload',reload);
  ipcRenderer.on('zoom in',(event: string,arugments: any) => {
    changeFontSize(1)
  });
  ipcRenderer.on('zoom out',(event: string,arugments: any) => {
    changeFontSize(-1)
  });
  ipcRenderer.on('zoom reset',(event: string,arugments: any) => {
    document.body.style.fontSize = null;
  });
  ipcRenderer.on('closed',(event: string,arugments: any) => {
    storage.set('tweets',timeline!.state.tweets,(error: string) => {
      if (error) throw error;
    })
  });

  storage.get('tweets', function(error: string,tweets: Tweet[]) {
    if (error) {
      console.log(error);
    }
    if (!Array.isArray(tweets)) {
      tweets = []
    }

    ReactDOM.render(
      <Timeline ref={(reference) => {timeline = reference}} tweets={tweets} />,
      document.getElementById("app")
    );

    setInterval(() => {
      reload('timer',null);
    },120 * 1000);
  });
});

