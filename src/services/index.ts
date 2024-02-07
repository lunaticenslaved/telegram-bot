import { actions as consumptionActions } from './consumptions';
import { actions as userActions } from './user';

export const commands = [...consumptionActions, ...userActions];
