import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import adapters from "@libraries/adapter";

type Line = {root: TMB.ScreenID; branch: TMB.ScreenID};

export const slice = createSlice({
  name: "lineage",
  initialState: adapters.lineage.getInitialState(),
  reducers: {
    branch: (state, action: PayloadAction<Line>) => {
      const {root, branch} = action.payload;

      if (state.entities[root]) {
        state.entities[root]!.branches.push(branch);
      } else {
        adapters.lineage.addOne(state, {root, branches: [branch]});
      }
    },
    clip: (state, action: PayloadAction<Line>) => {
      const {root} = action.payload;

      state.entities[root]!.branches.pop();
    },
  },
});

export const {branch, clip} = slice.actions;
export default slice.reducer;
