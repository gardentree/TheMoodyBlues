import {createEntityAdapter} from "@reduxjs/toolkit";

const adapters = {
  screens: createEntityAdapter<TMB.Screen>({selectId: (entity) => entity.identifier}),
  backstages: createEntityAdapter<TMB.Backstage>({selectId: (entity) => entity.identifier}),
  lineage: createEntityAdapter<TMB.Lineage>({selectId: (entity) => entity.root}),
};
export default adapters;
