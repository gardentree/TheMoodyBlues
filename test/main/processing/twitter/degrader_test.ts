import * as fs from "fs";
import {degrade} from "@source/main/processing/twitter/degrader";

function loadJSON(path: string) {
  return JSON.parse(fs.readFileSync(`./test/main/processing/${path}`).toString());
}
describe("degradeTweet", () => {
  it("when quoted & replied", () => {
    return expect(degrade(loadJSON("v2/reply_and_quote.json"))).toEqual([
      expect.objectContaining({
        id_str: "1460323750105075712",
        in_reply_to_status_id_str: "1460323748788072449",
        is_quote_status: true,
        quoted_status: expect.objectContaining({
          id_str: "1458552718214062081",
        }),
      }),
    ]);
  });
});
