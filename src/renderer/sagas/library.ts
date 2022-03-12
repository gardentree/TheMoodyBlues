import {ActionMeta} from "redux-actions";
import {put, call} from "redux-saga/effects";
import * as actions from "@actions";

const {facade} = window;

type SagaAction = ActionMeta<any, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
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
      yield put(actions.alarm(error));
    } finally {
      if (loading) yield put(actions.showLoading(false));
    }
  };
