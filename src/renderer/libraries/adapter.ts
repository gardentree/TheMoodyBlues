import {createEntityAdapter} from "@reduxjs/toolkit";

const adapters = {
  screens: createEntityAdapter<TMB.Screen>({selectId: (entity) => entity.identifier}),
  preferences: createEntityAdapter<TMB.Preference>({selectId: (entity) => entity.identifier}),
  lineage: createEntityAdapter<TMB.LineageTree>({selectId: (entity) => entity.root}),
};
export default adapters;
