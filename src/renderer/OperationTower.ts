import {EventEmitter} from 'fbemitter';

export class OperationTower {
  private static readonly singleton = new OperationTower()
  private readonly emitter = new EventEmitter()

  private constructor() {}

  public static listen(event: string,callback: Function): void {
    this.singleton.emitter.addListener(event,callback);
  }
  public static emit(event: string,...parameters: any[]) {
    this.singleton.emitter.emit(event,...parameters);
  }
}
