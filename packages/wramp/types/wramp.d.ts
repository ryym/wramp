declare module 'wramp' {
    export type Store<Proto> = Proto

    export interface StoreClass<Proto> {
        new(): Store<Proto>
    }

    export function defineStore<Proto>(stateClass: { prototype: Proto }): StoreClass<Proto>;

    export interface EventData {
        types: string[],
        originalClassName: string,
        originalMethod: Function,
        methodName: string,
        method: Function,
        payload: any[],
    }

    export interface UpdateData extends EventData {
        includes: [UpdateData];
    }

    export interface EffectData extends EventData {}

    export interface WatcherConfig {
        subWatchers: [StoreWatcher<any>];
    }

    export class StoreWatcher<S extends Store<any>> {
        constructor(store: S, config: WatcherConfig<S>);
        getStore(): S;
        onUpdate(handler: (data: UpdateData) => void): void;
        onEffect(handler: (data: EffectData) => void): void;
    }

    export function watch<S extends Store<any>>(
        store: S,
        config?: WatcherConfig<S>
    ): StoreWatcher<S>
}
