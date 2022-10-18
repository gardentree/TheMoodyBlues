import {expect} from "chai";
import reducer, {branch, clip} from "@actions/lineage";
import adapters from "@source/renderer/libraries/adapter";

describe(reducer.toString(), () => {
  describe(branch.toString(), () => {
    it("when new tree", () => {
      expect(reducer(adapters.lineage.getInitialState(), branch("parent", "child") as any)).to.deep.equal({
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

      expect(reducer(state, branch("parent", "child2") as any)).to.deep.equal({
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

      console.log(state);

      expect(reducer(state, clip("parent", "child2") as any)).to.deep.equal({
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
