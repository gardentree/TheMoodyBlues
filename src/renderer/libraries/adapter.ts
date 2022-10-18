import {createEntityAdapter} from "@reduxjs/toolkit";

const adapters = {
  screens: createEntityAdapter<TMB.Screen>({selectId: (entity) => entity.identity}),
  preferences: createEntityAdapter<TMB.Preference>({selectId: (entity) => entity.identity}),
  lineage: createEntityAdapter<TMB.LineageTree>({selectId: (entity) => entity.root}),
};
export default adapters;
