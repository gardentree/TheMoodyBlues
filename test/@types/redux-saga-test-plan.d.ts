type SagaType = (...params: unknown[]) => import("redux-saga").SagaIterator | Generator<unknown>;
