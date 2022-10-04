import logger from "@libraries/logger";

export function retry<P>(processing: () => Promise<P>, retryCount: number) {
  let promise: Promise<P> = processing();
  for (let i = 1; i <= retryCount; i++) {
    promise = promise.catch((error) => {
      logger.error(error);

      if (error.code == "ENOTFOUND") {
        logger.error(`retry ${i}`);
        return processing();
      }

      throw new Error(error);
    });
  }
  return promise;
}
