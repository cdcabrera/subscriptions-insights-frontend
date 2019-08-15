import { dateHelpers, getCurrentDate, setRangedDateTime, getRangedDateTime } from '../dateHelpers';
import { rhelApiTypes } from '../../types/rhelApiTypes';

describe('DateHelpers', () => {
  it('should have specific functions', () => {
    expect(dateHelpers).toMatchSnapshot('dateHelpers');
  });

  it('should return a date object for defaults', () => {
    expect(dateHelpers.defaultDateTime.start.constructor).toBe(Date);
    expect(dateHelpers.defaultDateTime.end.constructor).toBe(Date);

    expect(dateHelpers.weeklyDateTime.start.constructor).toBe(Date);
    expect(dateHelpers.weeklyDateTime.end.constructor).toBe(Date);

    expect(dateHelpers.monthlyDateTime.start.constructor).toBe(Date);
    expect(dateHelpers.monthlyDateTime.end.constructor).toBe(Date);

    expect(dateHelpers.quarterlyDateTime.start.constructor).toBe(Date);
    expect(dateHelpers.quarterlyDateTime.end.constructor).toBe(Date);
  });

  it('should return a predictable range of time', () => {
    const currentDate = getCurrentDate();
    const rangeDateTime = setRangedDateTime({ date: getCurrentDate(), subtract: 5, measurement: 'days' });

    expect({
      currentDate,
      rangeDateTime
    }).toMatchSnapshot('range of time');
  });

  it('should return a predictable range based on granularity', () => {
    const GRANULARITY_TYPES = rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES;
    const rangesOfDatesTimes = Object.values(GRANULARITY_TYPES).map(value => ({
      granularity: value,
      range: getRangedDateTime(value)
    }));

    expect(rangesOfDatesTimes).toMatchSnapshot('granularity range of time');
  });
});
