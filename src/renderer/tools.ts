import * as React from "react";
import {shell} from "electron"

export function openLinkOnAnchor(event: React.MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
  shell.openExternal(event.currentTarget.href);
}
