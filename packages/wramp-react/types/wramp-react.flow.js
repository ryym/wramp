declare module 'wramp-react' {
  import type { Store, StoreWatcher } from 'wramp';
  import type { Component } from 'react';

  declare type ComponentClass<P> = Class<Component<any, P, any>>;
  declare type StatelessComponent<P> = (props: P) => ?React$Element<any>;
  declare type ReactComponent<P> = ComponentClass<P> | StatelessComponent<P>;

  declare interface Connect<S> {
    <P, WP>(
      component: ReactComponent<P>,
      config: {
        propsMapper: (store: S) => (props: WP) => P
      }
    ): ComponentClass<WP>
  }

  declare function createConnector<S: Store<any>>(
    watcher: StoreWatcher<S>
  ): Connect<S>
}
