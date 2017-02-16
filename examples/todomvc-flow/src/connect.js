// @flow

import { createConnector } from 'wramp-react';
import { watcher } from './store';

export default createConnector(watcher);
