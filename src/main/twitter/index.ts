import {ipcMain, shell, WebContents} from "electron";
import storage from "./storage";
import {authorize, call, getRequestToken} from "./authentication";
import growl from "./growly";
import {Actions as FacadeActions} from "@shared/facade";
import logger from "electron-log";

let observed: boolean = false;

export function setup(renderer: WebContents) {
  renderer.on("dom-ready", () => {
    prepare(renderer);
  });
}
async function prepare(renderer: WebContents) {
  if (observed) {
    renderer.send(FacadeActions.LAUNCH);
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
  ipcMain.handle(FacadeActions.AGENT_GET, (event, values) => {
    const {path, parameters} = values;

    return agent.get(path, parameters);
  });
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

  ipcMain.on(FacadeActions.GROWL, (event, values) => {
    const {tweets} = values;

    growl(tweets);
  });

  ipcMain.handle(FacadeActions.STORAGE_TIMELINE_PREFERENCES_LOAD, (event, values) => {
    return storage.getTimelinePreferences();
  });
  ipcMain.on(FacadeActions.STORAGE_TIMELINE_PREFERENCES_SAVE, (event, values) => {
    const {timelines} = values;

    storage.setTimelinePreferences(timelines);
  });
  ipcMain.handle(FacadeActions.STORAGE_TWEETS_LOAD, (event, values) => {
    const {name} = values;

    return storage.getTweets(name);
  });
  ipcMain.on(FacadeActions.STORAGE_TWEETS_SAVE, (event, values) => {
    const {name, tweets} = values;

    storage.setTweets(name, tweets);
  });
  ipcMain.handle(FacadeActions.STORAGE_MUTE_LOAD, (event, values) => {
    return storage.getMutePreference();
  });
  ipcMain.on(FacadeActions.STORAGE_MUTE_SAVE, (event, values) => {
    const {preference} = values;

    storage.setMutePreference(preference);
  });

  observed = true;
  renderer.send(FacadeActions.LAUNCH);
}
