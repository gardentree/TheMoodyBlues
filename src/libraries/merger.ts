import deepmarge from "deepmerge";

const overwrite = (destinationArray: any, sourceArray: any, options: any) => sourceArray;

export default function merge(a: any, b: any): any {
  return deepmarge(a, b, {arrayMerge: overwrite});
}
