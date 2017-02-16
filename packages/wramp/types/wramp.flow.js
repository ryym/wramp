declare module 'wramp' {
  declare type Store<Proto> = Proto;

  declare function defineStore<State>(stateClass: Class<State>): Class<Store<State>>;

  declare interface EventData {
    types: string[],
    originalClassName: string,
    originalMethod: Function,
    methodName: string,
    method: Function,
    payload: any[],
  }

  declare interface UpdateData extends EventData {
    includes: [UpdateData];
  }

  declare interface EffectData extends EventData {}

  declare interface WatcherConfig {
    subWatchers: [StoreWatcher<any>];
  }

  declare class StoreWatcher<S: Store<any>> {
    getStore(): S;
    onUpdate(handler: (u: UpdateData) => void): void;
    onEvent(handler: (e: EventData) => void): void;
  }

  declare function watch<S: Store<any>>(
    store: S,
    config?: WatcherConfig<S>
  ): StoreWatcher<S>;
}
