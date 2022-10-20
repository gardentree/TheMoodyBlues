import {expect} from "chai";
import reducer, {branch, clip} from "@actions/lineage";
import adapters from "@source/renderer/libraries/adapter";

describe("@renderer/actions/lineage", () => {
  describe(branch.toString(), () => {
    it("when new tree", () => {
      expect(reducer(adapters.lineage.getInitialState(), branch({root: "parent", branch: "child"}))).to.deep.equal({
        ids: ["parent"],
        entities: {
          parent: {
            root: "parent",
            branches: ["child"],
          },
        },
      });
    });
    it("when existing tree", () => {
      const state = adapters.lineage.addMany(adapters.lineage.getInitialState(), [
        {
          root: "parent",
          branches: ["child1"],
        },
      ]);

      expect(reducer(state, branch({root: "parent", branch: "child2"}))).to.deep.equal({
        ids: ["parent"],
        entities: {
          parent: {
            root: "parent",
            branches: ["child1", "child2"],
          },
        },
      });
    });
  });
  describe(clip.toString(), () => {
    it("clip", () => {
      const state = adapters.lineage.addMany(adapters.lineage.getInitialState(), [
        {
          root: "parent",
          branches: ["child1", "child2"],
        },
      ]);

      expect(reducer(state, clip({root: "parent", branch: "child2"}))).to.deep.equal({
        ids: ["parent"],
        entities: {
          parent: {
            root: "parent",
            branches: ["child1"],
          },
        },
      });
    });
  });
});
