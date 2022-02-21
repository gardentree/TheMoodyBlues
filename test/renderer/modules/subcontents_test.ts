import {expect} from "chai";
import * as actions from "@actions";
import {default as reducer} from "@reducers/subcontents";

const template = {
  tweets: [],
};

describe(reducer.name, () => {
  it("updateTweetsInSubContents", () => {
    expect(reducer(template, actions.updateTweetsInSubContents([]))).to.deep.equal({tweets: []});
  });
});
