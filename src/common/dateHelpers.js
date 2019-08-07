import moment from 'moment/moment';
import { helpers } from './helpers';

const getDate = () =>
  (helpers.TEST_MODE && '20190720') || (helpers.DEV_MODE && process.env.REACT_APP_DEBUG_DEFAULT_DATETIME) || new Date();

const defaultDateTime = ((date = getDate()) => ({
  start: moment
    .utc(date)
    .startOf('day')
    .subtract(30, 'days')
    .toDate(),
  end: moment
    .utc(date)
    .endOf('day')
    .toDate()
}))();

const rangedDateTime = ({ date, subtract, measurement }) => ({
  start: moment
    .utc(date)
    .startOf('day')
    .subtract(subtract, measurement)
    .toDate(),
  end: moment
    .utc(date)
    .endOf('day')
    .toDate()
});

const weeklyDateTime = rangedDateTime({ date: getDate(), subtract: 12, measurement: 'weeks' });
const monthlyDateTime = rangedDateTime({ date: getDate(), subtract: 12, measurement: 'months' });
const quarterlyDateTime = rangedDateTime({ date: getDate(), subtract: 4, measurement: 'years' });

const dateHelpers = {
  weeklyDateTime,
  monthlyDateTime,
  quarterlyDateTime,
  defaultDateTime
};

export { dateHelpers as default, dateHelpers, defaultDateTime };
