import moment from 'moment';

const chartDateFormat = 'MMM D';

const zeroedUsageArray = (startDate, endDate) => {
  const zeroedArray = [];
  const diff = endDate.diff(startDate, 'days');
  for (let i = 0; i < diff + 1; i++) {
    const clone = moment(startDate);
    zeroedArray.push({ x: clone.add(i, 'days').format(chartDateFormat), y: 0 });
  }
  return zeroedArray;
};

const getLabel = (i, cores, previousCores, formattedDate, tSockectsOn, tFromPrevious) => {
  if (i === 0) {
    return `${cores} ${tSockectsOn} ${formattedDate}`;
  }
  const prev = cores - previousCores;
  return `${cores} ${tSockectsOn} ${formattedDate} \r\n ${prev > -1 ? `+${prev}` : prev} ${tFromPrevious}`;
};

const convertGraphData = ({ usage, startDate, endDate, tSockectsOn, tFromPrevious }) => {
  /**
   * convert json usage report from this format:
   * {cores: 56, date: "2019-06-01T00:00:00Z", instance_count: 28}
   * to this format:
   * { x: 'Jun 1', y: 56, label: '56 Sockets on Jun 1 \r\n +5 from previous day' },
   */
  if (usage === undefined || usage.length === 0) {
    return zeroedUsageArray(startDate, endDate);
  }
  try {
    const chartData = [];
    for (let i = 0; i < usage.length; i++) {
      const formattedDate = moment.utc(usage[i].date).format(chartDateFormat);
      const label = getLabel(
        i,
        usage[i].cores,
        i > 0 ? usage[i - 1].cores : null,
        formattedDate,
        tSockectsOn,
        tFromPrevious
      );
      chartData.push({ x: formattedDate, y: usage[i].cores, label });
    }
    return chartData;
  } catch (e) {
    // todo: show error toast ?
    return zeroedUsageArray(startDate, endDate);
  }
};

const getGraphHeight = (breakpoints, currentBreakpoint) =>
  (breakpoints[currentBreakpoint] > breakpoints.md && 200) || 400;

const getTooltipDimensions = (breakpoints, currentBreakpoint) => {
  if (breakpoints[currentBreakpoint] < breakpoints.sm) {
    return { height: 60, width: 200 };
  }
  if (breakpoints[currentBreakpoint] < breakpoints.md) {
    return { height: 50, width: 180 };
  }
  if (breakpoints[currentBreakpoint] < breakpoints.lg) {
    return { height: 40, width: 140 };
  }
  if (breakpoints[currentBreakpoint] < breakpoints.xl) {
    return { height: 40, width: 120 };
  }
  if (breakpoints[currentBreakpoint] < breakpoints.xl2) {
    return { height: 30, width: 90 };
  }
  return { height: 20, width: 80 };
};

const getTooltipFontSize = (breakpoints, currentBreakpoint) => {
  if (breakpoints[currentBreakpoint] > breakpoints.lg) {
    return 8;
  }
  if (breakpoints[currentBreakpoint] > breakpoints.md) {
    return 12;
  }
  return 14;
};

const graphHelpers = { convertGraphData, getGraphHeight, getTooltipDimensions, getTooltipFontSize, zeroedUsageArray };

export {
  graphHelpers as default,
  graphHelpers,
  zeroedUsageArray,
  chartDateFormat,
  convertGraphData,
  getGraphHeight,
  getTooltipDimensions,
  getTooltipFontSize
};
