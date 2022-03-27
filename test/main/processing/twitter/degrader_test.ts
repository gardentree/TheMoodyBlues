import {expect, use} from "chai";
import chaiSubset from "chai-subset";
import * as fs from "fs";
import {degrade} from "@source/main/processing/twitter/degrader";

use(chaiSubset);

function loadJSON(path) {
  return JSON.parse(fs.readFileSync(`./test/main/processing/${path}`));
}
describe("degradeTweet", () => {
  it("when quoted & replied", () => {
    return expect(degrade(loadJSON("v2/reply_and_quote.json"))).to.containSubset([
      {
        id_str: "1460323750105075712",
        in_reply_to_status_id_str: "1460323748788072449",
        is_quote_status: true,
      },
    ]);
  });
});
