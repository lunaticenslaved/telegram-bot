import { createAction } from '../../controllers.model';

import {
  AddActivitySchema,
  ListActivitiesSchema,
  RemoveActivitySchema,
  addActivity,
  listActivities,
  removeActivity,
} from './action.activity';
import { SetCaloriesSchema, setCalories } from './action.calories';
import { SetWeightSchema, setWeight } from './action.weight';
import { upsertStatistic } from './action.weight-statistic';

export const actions = {
  setWeight: createAction({
    command: 'setWeight',
    schema: SetWeightSchema,
    argsTransformer: args => ({
      weight: args[0],
      date: args[1] || 'today',
    }),
    async handler(ctx, { data, user }) {
      const response = await setWeight({
        ...data,
        userId: user.id,
      });

      await upsertStatistic({
        date: data.date,
        userId: user.id,
      });

      ctx.reply(response);
    },
  }),
  setCalories: createAction({
    command: 'setCalories',
    schema: SetCaloriesSchema,
    argsTransformer: args => ({
      calories: args[0],
      date: args[1] || 'today',
    }),
    async handler(ctx, { data, user }) {
      const response = await setCalories({
        ...data,
        userId: user.id,
      });

      ctx.reply(response);
    },
  }),
  addActivity: createAction({
    command: 'addActivity',
    schema: AddActivitySchema,
    argsTransformer: args => ({
      minutes: args[0],
      type: args[1],
      date: args[2] || 'today',
    }),
    async handler(ctx, { data, user }) {
      const response = await addActivity({
        ...data,
        userId: user.id,
      });

      ctx.reply(response);
    },
  }),
  listActivities: createAction({
    command: 'listActivities',
    schema: ListActivitiesSchema,
    argsTransformer: args => ({
      date: args[0] || 'today',
    }),
    async handler(ctx, { data, user }) {
      const activities = await listActivities({
        ...data,
        userId: user.id,
      });

      if (!activities.length) {
        ctx.reply('No activities found');
      } else {
        ctx.reply(
          activities
            .map(activity => `${activity.id} - ${activity.type} - ${activity.minutes} min`)
            .join('\n'),
        );
      }
    },
  }),
  removeActivity: createAction({
    command: 'removeActivity',
    schema: RemoveActivitySchema,
    argsTransformer: args => ({
      activityId: args[0] || '',
    }),
    async handler(ctx, { data, user }) {
      await removeActivity({
        ...data,
        userId: user.id,
      });

      ctx.reply('Activity removed');
    },
  }),
};
