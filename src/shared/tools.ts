import he from "he";

export function decodeHTML(html: string): string {
  return he.decode(html);
}

export const environment = {
  isDevelopment: () => {
    return process.env.NODE_ENV !== "production";
  },
};
