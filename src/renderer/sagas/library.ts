import {PayloadAction} from "@reduxjs/toolkit";
import {put, call} from "redux-saga/effects";
import * as actions from "@actions";

const {facade} = window;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SagaAction = PayloadAction<never, string, {silently: boolean} | any>;
type Saga = (action: SagaAction) => Generator;

export const wrap = (saga: Saga) =>
  function* (action: SagaAction) {
    facade.logger.verbose(action);

    const loading = !action.meta || !action.meta.silently;
    try {
      if (loading) yield put(actions.showLoading(true));
      yield call(saga, action);
    } catch (error: unknown) {
      facade.logger.error(error);
      if (error instanceof Error) {
        facade.logger.error(error.stack);
      }

      if (error instanceof Error || typeof error === "string") {
        yield put(actions.alarm(error));
      }
    } finally {
      if (loading) yield put(actions.showLoading(false));
    }
  };
