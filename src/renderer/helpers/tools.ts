import * as React from "react";
import {shell} from "electron";

export function openLinkOnAnchor(event: React.MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
  shell.openExternal(event.currentTarget.href);
}

const decoder = document.createElement("textarea");
export function decodeHTML(html: string): string {
  decoder.innerHTML = html;

  return decoder.value;
}
