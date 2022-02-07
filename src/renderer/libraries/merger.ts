import deepmerge from "deepmerge";

const overwrite = (destinationArray: any, sourceArray: any, options: any) => sourceArray;

export default function merge(a: any, b: any): any {
  return deepmerge(a, b, {arrayMerge: overwrite});
}
