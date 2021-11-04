import {expect, use} from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";
import {incarnate} from "@source/preload/twitter_agent";

use(chaiAsPromised);

describe("retrieveConversation", () => {
  const criterion_template: Twitter.Tweet = {
    user: {
      screen_name: "gian",
    },
    in_reply_to_status_id_str: "0",
  };

  it("rejected", () => {
    const agent = incarnate({});

    return expect(agent.retrieveConversation({})).to.be.rejected;
  });

  it("can't find tweet", () => {
    const callback = sinon.stub();
    callback.onCall(0).yields(
      null,
      {
        statuses: [],
      },
      null
    );
    callback.onCall(1).yields(
      "not found",
      {
        statuses: [],
      },
      null
    );

    const agent = incarnate({get: callback});

    return expect(agent.retrieveConversation(criterion_template)).to.eventually.deep.equal([criterion_template]);
  });
});
