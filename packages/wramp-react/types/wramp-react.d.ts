declare module '*wramp-react' { // TODO: remove *
    import { Component, ComponentClass, StatelessComponent } from 'react'

    type ReactComponent<P> = ComponentClass<P> | StatelessComponent<P>;

    export interface Connect<S> {
        <P, WP>(
            component: ReactComponent<P>,
            config: {
                propsMapper: (store: S) => (props: WP) => P
            }
        ): ComponentClass<WP>
    }

    export function createConnector<S extends Store<any>>(
        watcher: StoreWatcher<S>
    ): Connect<S>
}
