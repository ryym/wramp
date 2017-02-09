import {
  DefaultEventTypes as Types,
  isUpdate,
  isEffect,
} from './defaultEvents';
import defineProxyClass from './proxyClassDefiner';

export const makeDefaultStoreConfig = () => ({
  events: [
    [Types.UPDATE, isUpdate],
    [Types.EFFECT, isEffect],
  ],
});

export default function defineStore(
  StateClass,
  config = makeDefaultStoreConfig()
) {
  return defineProxyClass(StateClass, config);
}
