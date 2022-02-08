import deepmerge from "deepmerge";

const overwrite = (destinationArray: unknown[], sourceArray: unknown[], options: deepmerge.Options) => sourceArray;

export default function merge<T>(a: Partial<T>, b: Partial<T>): T {
  return deepmerge<T>(a, b, {arrayMerge: overwrite});
}
