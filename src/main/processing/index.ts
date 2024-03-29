import {ipcMain, shell, clipboard, WebContents, Menu} from "electron";
import storage from "./storage";
import {authorize, call, getRequestToken} from "./authentication";
import * as growl from "./growl";
import {Actions as FacadeActions} from "@shared/facade";
import {environment} from "@shared/tools";
import logger from "@libraries/logger";

let observed = false;

export function setup(renderer: WebContents) {
  renderer.on("dom-ready", () => {
    prepare(renderer);
  });
}
async function prepare(renderer: WebContents) {
  if (observed) {
    renderer.send(FacadeActions.LAUNCH);
    return;
  }

  const agent = call();
  if (agent) {
    observe(renderer, agent);
    return;
  }

  const requestToken = await getRequestToken();
  shell.openExternal(`https://api.twitter.com/oauth/authorize?oauth_token=${requestToken.key}`);

  ipcMain.on(FacadeActions.AUTHORIZE, async (event, values) => {
    const {verifier} = values;

    await authorize(requestToken, verifier)
      .then((agent) => {
        observe(renderer, agent);
      })
      .catch((error) => {
        logger.error(error);
        renderer.send(FacadeActions.ALERT, {error});
      });
  });

  renderer.send(FacadeActions.SHOW_VERIFIER_FORM);
}
function observe(renderer: WebContents, agent: TMB.TwitterAgent) {
  ipcMain.handle(FacadeActions.AGENT_RETRIEVE_TIMELINE, (event, values) => {
    const {since_id} = values;

    return agent.retrieveTimeline(since_id);
  });
  ipcMain.handle(FacadeActions.AGENT_SEARCH, (event, values) => {
    const {query, since_id} = values;

    return agent.search(query, since_id);
  });
  ipcMain.handle(FacadeActions.AGENT_RETRIEVE_TIMELINE_OF_USER, (event, values) => {
    const {name} = values;

    return agent.retrieveTimelineOfUser(name);
  });
  ipcMain.handle(FacadeActions.AGENT_RETRIEVE_MENTIONS, (event, values) => {
    const {since_id} = values;

    return agent.retrieveMentions(since_id);
  });
  ipcMain.handle(FacadeActions.AGENT_RETRIEVE_CONVERSATION, (event, values) => {
    const {criterion, options} = values;

    return agent.retrieveConversation(criterion, options);
  });
  ipcMain.handle(FacadeActions.AGENT_LISTS, () => {
    return agent.lists();
  });
  ipcMain.handle(FacadeActions.AGENT_RETRIEVE_TIMELINE_OF_LIST, (event, values) => {
    const {list_id, since_id} = values;

    return agent.retrieveTimelineOfList(list_id, since_id);
  });

  ipcMain.on(FacadeActions.COPY_TO_CLIPBOARD, (event, values) => {
    const {text} = values;

    clipboard.writeText(text);
  });

  ipcMain.on(FacadeActions.GROWL, (event, values) => {
    const {tweets} = values;

    growl.notify(tweets);
  });
  ipcMain.on(FacadeActions.GROWL_IS_RUNNING, (event) => {
    event.returnValue = growl.isRunning();
  });

  ipcMain.on(FacadeActions.OPEN_EXTERNAL, (event, values) => {
    const {url} = values;

    shell.openExternal(url);
  });

  ipcMain.handle(FacadeActions.STORAGE_BACKSTAGES_LOAD, (event, values) => {
    return storage.getBackstages();
  });
  ipcMain.on(FacadeActions.STORAGE_BACKSTAGES_SAVE, (event, values) => {
    const {screens} = values;

    storage.setBackstages(screens);
  });
  ipcMain.handle(FacadeActions.STORAGE_TWEETS_LOAD, (event, values) => {
    const {name} = values;

    return storage.getTweets(name);
  });
  ipcMain.on(FacadeActions.STORAGE_TWEETS_SAVE, (event, values) => {
    const {name, tweets} = values;

    storage.setTweets(name, tweets);
  });
  ipcMain.handle(FacadeActions.STORAGE_GATEKEEPER_LOAD, (event, values) => {
    return storage.getGatekeeper();
  });
  ipcMain.on(FacadeActions.STORAGE_GATEKEEPER_SAVE, (event, values) => {
    const {preference} = values;

    storage.setGatekeeper(preference);
  });

  ipcMain.on(FacadeActions.OPEN_TWEET_MENU, (event, context: TMB.TweetMenu) => {
    const template: Electron.MenuItemConstructorOptions[] = [
      {
        label: "ブラウザで開く",
        click() {
          renderer.send(FacadeActions.OPEN_TWEET_IN_BROWSER, context);
        },
      },
      {
        label: "会話を表示",
        click() {
          renderer.send(FacadeActions.SHOW_CONVERSATION_FOR_TWEET, context);
        },
      },
      {
        label: "つながりを表示",
        click() {
          renderer.send(FacadeActions.SHOW_CHAIN_FOR_TWEET, context);
        },
      },
    ];

    if (context.keyword.length > 0) {
      template.push({
        label: `"${context.keyword}"を検索`,
        click() {
          renderer.send(FacadeActions.SEARCH, context);
        },
      });

      template.push({
        label: `"${context.keyword}"をミュート`,
        click() {
          renderer.send(FacadeActions.DIALOG, {type: "taboo", context});
        },
      });
    }

    if (environment.isDevelopment()) {
      template.push({
        label: "JSON形式でコピー",
        click() {
          renderer.send(FacadeActions.COPY_TWEET_IN_JSON, context);
        },
      });
    }

    const menu = Menu.buildFromTemplate(template);
    menu.popup();
  });

  ipcMain.on(FacadeActions.SHOW_MODE_MENU, (event, {identifier, mode}) => {
    const template: Electron.MenuItemConstructorOptions[] = [
      {
        label: "ツイート",
        type: "radio",
        checked: mode == "tweet",
        click() {
          renderer.send(FacadeActions.CHANGE_MODE, {identifier: identifier, mode: "tweet"});
        },
      },
      {
        label: "メディア",
        type: "radio",
        checked: mode == "media",
        click() {
          renderer.send(FacadeActions.CHANGE_MODE, {identifier: identifier, mode: "media"});
        },
      },
    ];

    const menu = Menu.buildFromTemplate(template);
    menu.popup();
  });

  observed = true;
  renderer.send(FacadeActions.LAUNCH);
}
