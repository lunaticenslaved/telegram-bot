import { Action } from '../controllers.model';

import { actions as consumptionActions } from './consumptions';
import { actions as userActions } from './user';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const commands = [...Object.values(consumptionActions), ...userActions] as Action<any>[];
