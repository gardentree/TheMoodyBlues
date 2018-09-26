export default interface Action {
  type: string;
  payload: any | null;
  meta: any | null;
  error: any;
}
