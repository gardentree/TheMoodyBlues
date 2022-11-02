import * as screens from "./screens";
import * as backstages from "./backstages";
import * as gatekeeper from "./gatekeeper";
import * as principal from "./principal";
import * as lineage from "./lineage";
import * as miscellany from "./miscellany";

export const {updateTweets, mark, setupSearch, changeMode, prepareScreen, closeScreen, updateScreenStatus} = screens;
export const {prepare: prepareBackstages} = backstages;
export const {prepare: prepareGatekeeper, update: updateGatekeeper, addTaboo, deleteTaboo} = gatekeeper;
export const {setScreens, focusScreen, zoomIn, zoomOut, zoomReset, showLoading, openDialog, closeDialog} = principal;
export const {branch, clip} = lineage;

export const {prepareState, reconfigure, reload, reloadFocusedScreen, mountScreen, unmountScreen, searchTweets, displayUserTimeline, displayConversation, focusTweet, focusLatestTweet, focusUnreadTweet, alarm} = miscellany;

import recucers from "./reducer";
import {AnyAction, ThunkDispatch} from "@reduxjs/toolkit";
export type Dispatch = ThunkDispatch<ReturnType<typeof recucers>, unknown, AnyAction>;
