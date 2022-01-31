import he from "he";

export function decodeHTML(html: string): string {
  return he.decode(html);
}
