import {takeLatest, takeEvery} from "redux-saga/effects";
import * as actions from "@actions";
import {PayloadAction} from "@reduxjs/toolkit";
import {wrap} from "./library";

function* focusTweet(action: PayloadAction<{tweet: Twitter.Tweet}>) {
  const {tweet} = action.payload;
  const container = getContainer();
  const element = <HTMLElement>container.querySelector(`li[data-id="${tweet.id_str}"] *[tabindex='-1']`)!;

  yield scrollTo(container, element, 500);
  yield element.focus();
}

function* focusLatestTweet(action: PayloadAction) {
  const container = getContainer();
  const latest = <HTMLElement>container.querySelector("li:first-child > *[tabindex='-1']")!;

  yield scrollTo(container, latest, 500);
  yield latest.focus();
}

function* focusUnreadTweet(action: PayloadAction) {
  const container = getContainer();
  const unreads = container.querySelectorAll("li.unread > *[tabindex='-1']");
  const oldest = <HTMLElement>Array.from(unreads).slice(-1)[0];

  if (oldest) {
    yield scrollTo(container, oldest, 500);
    yield oldest.focus();
  } else {
    yield focusLatestTweet(action);
  }
}

function* alarm(action: PayloadAction<{message: string}>) {
  yield window.alert(action.payload.message);
}

// prettier-ignore
export default [
  takeLatest(actions.focusTweet.type, wrap(focusTweet)),
  takeLatest(actions.focusLatestTweet.type, wrap(focusLatestTweet)),
  takeLatest(actions.focusUnreadTweet.type, wrap(focusUnreadTweet)),
  takeEvery(actions.alarm.type, alarm),
];

function getContainer(): Element {
  const lists = document.querySelectorAll("#principal > .window-content[style*=block] ol.tweets")!;

  return lists[lists.length - 1];
}
function scrollTo(container: Element, target: Element, duration: number) {
  const start = container.scrollTop;
  const change = target.getBoundingClientRect().top - container.getBoundingClientRect().top;
  const increment = 20;
  let currentTime = 0;

  const animateScroll = function () {
    currentTime += increment;
    const value = easeInOutQuad(currentTime, start, change, duration);
    container.scrollTop = value;
    if (currentTime < duration) {
      setTimeout(animateScroll, increment);
    }
  };
  animateScroll();
}
function easeInOutQuad(time: number, start: number, change: number, duration: number) {
  time /= duration / 2;
  if (time < 1) return (change / 2) * time * time + start;
  time--;
  return (-change / 2) * (time * (time - 2) - 1) + start;
}
