import {expect, use} from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";
import {incarnate} from "@source/preload/twitter_agent";

use(chaiAsPromised);

describe("retrieveTimeline", () => {
  it("success", () => {
    const callback = sinon.stub();
    callback.yields(
      null,
      [
        {
          id: 1,
        },
      ],
      null
    );

    const agent = incarnate({get: callback});

    return expect(agent.retrieveTimeline(null)).to.eventually.deep.equal([{id: 1}]);
  });
});

describe("search", () => {
  it("success", () => {
    const callback = sinon.stub();
    callback.yields(
      null,
      {
        statuses: [
          {
            id: 1,
          },
        ],
      },
      null
    );

    const agent = incarnate({get: callback});

    return expect(agent.search("くえりー")).to.eventually.deep.equal([{id: 1}]);
  });
});

describe("retrieveTimelineOfUser", () => {
  it("success", () => {
    const callback = sinon.stub();
    callback.yields(
      null,
      [
        {
          id: 1,
        },
      ],
      null
    );

    const agent = incarnate({get: callback});

    return expect(agent.retrieveTimelineOfUser("gian")).to.eventually.deep.equal([{id: 1}]);
  });
});

describe("retrieveMentions", () => {
  it("success", () => {
    const callback = sinon.stub();
    callback.yields(
      null,
      [
        {
          id: 1,
        },
      ],
      null
    );

    const agent = incarnate({get: callback});

    return expect(agent.retrieveMentions(null)).to.eventually.deep.equal([{id: 1}]);
  });
});

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

describe("lists", () => {
  it("success", () => {
    const callback = sinon.stub();
    callback.yields(
      null,
      [
        {
          id: 1,
        },
        {
          id: 2,
        },
      ],
      null
    );

    const agent = incarnate({get: callback});

    return expect(agent.lists()).to.eventually.deep.equal([{id: 2}, {id: 1}]);
  });
});

describe("retrieveTimelineOfList", () => {
  it("success", () => {
    const callback = sinon.stub();
    callback.yields(
      null,
      [
        {
          id: 1,
        },
      ],
      null
    );

    const agent = incarnate({get: callback});

    return expect(agent.retrieveTimelineOfList("news")).to.eventually.deep.equal([{id: 1}]);
  });
});
