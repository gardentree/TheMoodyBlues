import {takeLatest, takeEvery} from "redux-saga/effects";
import * as actions from "@actions";
import {Action, BaseAction} from "redux-actions";

function focusLatestTweet(action: BaseAction) {
  const container = getContainer();
  const latest = <HTMLElement>container.querySelector("li:first-child")!;

  scrollTo(container, latest, 500);
  latest.focus();
}

function focusUnreadTweet(action: BaseAction) {
  const container = getContainer();
  const unreads = container.querySelectorAll("li.unread");
  const oldest = <HTMLElement>Array.from(unreads).slice(-1)[0];

  if (oldest) {
    scrollTo(container, oldest, 500);
    oldest.focus();
  } else {
    focusLatestTweet(action);
  }
}

function alarm(action: Action<{message: string}>) {
  window.alert(action.payload.message);
}

// prettier-ignore
export default [
  takeLatest(actions.focusLatestTweet.toString(), focusLatestTweet),
  takeLatest(actions.focusUnreadTweet.toString(), focusUnreadTweet),
  takeEvery(actions.alarm.toString(), alarm),
];

function getContainer(): Element {
  return document.querySelector(".window-content[style*=block] > div")!;
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
