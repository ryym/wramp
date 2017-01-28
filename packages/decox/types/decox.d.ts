declare module '*decox' { // TODO: remove *
    export type Store<Proto> = Proto

    export interface StoreClass<Proto> {
        new(): Store<Proto>
    }

    export function defineStore<Proto>(stateClass: { prototype: Proto }): StoreClass<Proto>;

    export interface EventData {
        from: string;
        method: string;
        payload: [any];
    }
    export interface UpdateData extends EventData {
        includes: [UpdateData];
    }
    export interface ActionData extends EventData {}

    export interface WatcherConfig<S extends Store<any>> {
        subStores(store: S): [Store<any>];
    }

    export class StoreWatcher<S extends Store<any>> {
        constructor(store: S, config: WatcherConfig<S>);
        getStore(): S;
        onUpdate(handler: (data: UpdateData) => void): void;
        onAction(handler: (data: ActionData) => void): void;
    }

    export function watch<S extends Store<any>>(
        store: S,
        config?: WatcherConfig<S>
    ): StoreWatcher<S>
}
