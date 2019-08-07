import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHead, CardActions, CardBody } from '@patternfly/react-core';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components';
import { Chart, ChartAxis, ChartBar, ChartStack, ChartTooltip } from '@patternfly/react-charts';
import { Select } from '../select/select';
import { connectTranslate, reduxActions } from '../../redux';
import { helpers, dateHelpers, graphHelpers } from '../../common';
import { rhelApiTypes } from '../../types/rhelApiTypes';

const GRANULARITY_TYPES = rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES;

class RhelGraphCard extends React.Component {
  constructor(props) {
    super(props);

    this.containerRef = React.createRef();

    this.dateMenuOptions = [
      { value: this.getMenuText(GRANULARITY_TYPES.DAILY), isPlaceholder: true, granularity: GRANULARITY_TYPES.DAILY },
      { value: this.getMenuText(GRANULARITY_TYPES.WEEKLY), granularity: GRANULARITY_TYPES.WEEKLY },
      { value: this.getMenuText(GRANULARITY_TYPES.MONTHLY), granularity: GRANULARITY_TYPES.MONTHLY },
      { value: this.getMenuText(GRANULARITY_TYPES.QUARTERLY), granularity: GRANULARITY_TYPES.QUARTERLY }
    ];

    this.state = {
      dateMenuIsExpanded: false,
      activeDateMenuOption: this.getMenuText(GRANULARITY_TYPES.DAILY),
      granularity: GRANULARITY_TYPES.DAILY,
      startDate: dateHelpers.defaultDateTime.start,
      endDate: dateHelpers.defaultDateTime.end,
      chartWidth: 0
    };
  }

  componentDidMount() {
    this.onUpdateGraphData();
    this.onResizeContainer();
    window.addEventListener('resize', this.onResizeContainer);
  }

  componentDidUpdate(prevProps, prevState) {
    const { granularity, startDate, endDate } = this.state;

    if (granularity !== prevState.granularity || startDate !== prevState.startDate || endDate !== prevState.endDate) {
      this.onUpdateGraphData();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResizeContainer);
  }

  onUpdateGraphData = () => {
    const { getGraphReports } = this.props;
    const { granularity, startDate, endDate } = this.state;

    getGraphReports({
      [rhelApiTypes.RHSM_API_QUERY_GRANULARITY]: granularity,
      [rhelApiTypes.RHSM_API_QUERY_START_DATE]: startDate.toISOString(),
      [rhelApiTypes.RHSM_API_QUERY_END_DATE]: endDate.toISOString()
    });
  };

  onResizeContainer = () => {
    const containerElement = this.containerRef.current;

    if (containerElement && containerElement.clientWidth) {
      this.setState({ chartWidth: containerElement.clientWidth });
    }
  };

  onToggle = isExpanded => {
    this.setState({ dateMenuIsExpanded: isExpanded });
  };

  onSelect = (event, selection) => {
    const option = this.dateMenuOptions.find(o => o.value === selection);
    const range = this.getRangedDateTime(option.granularity);

    this.setState({
      activeDateMenuOption: selection,
      granularity: option.granularity,
      startDate: range.startDate,
      endDate: range.endDate
    });
  };

  getRangedDateTime = granularity => {
    switch (granularity) {
      case GRANULARITY_TYPES.DAILY:
        return { startDate: dateHelpers.defaultDateTime.start, endDate: dateHelpers.defaultDateTime.end };
      case GRANULARITY_TYPES.WEEKLY:
        return { startDate: dateHelpers.weeklyDateTime.start, endDate: dateHelpers.defaultDateTime.end };
      case GRANULARITY_TYPES.MONTHLY:
        return { startDate: dateHelpers.monthlyDateTime.start, endDate: dateHelpers.monthlyDateTime.end };
      case GRANULARITY_TYPES.QUARTERLY:
        return { startDate: dateHelpers.quarterlyDateTime.start, endDate: dateHelpers.quarterlyDateTime.end };
      default:
        return { startDate: dateHelpers.defaultDateTime.start, endDate: dateHelpers.defaultDateTime.end };
    }
  };

  getMenuText = value => {
    const { t } = this.props;
    switch (value) {
      case GRANULARITY_TYPES.DAILY:
        return t('curiosity-graph.dropdownDaily', 'Daily');
      case GRANULARITY_TYPES.WEEKLY:
        return t('curiosity-graph.dropdownDaily', 'Weekly');
      case GRANULARITY_TYPES.MONTHLY:
        return t('curiosity-graph.dropdownDaily', 'Monthly');
      case GRANULARITY_TYPES.QUARTERLY:
        return t('curiosity-graph.dropdownDaily', 'Quarterly');
      default:
        return t('curiosity-graph.dropdownDaily', 'Daily');
    }
  };

  renderChart() {
    const { chartWidth } = this.state;
    const { graphData, t, startDate, endDate } = this.props;

    // todo: evaluate show error toast
    // todo: evaluate the granularity here: "daily" "weekly" etc. and pass startDate/endDate
    const { chartData, chartDomain, tickValues } = graphHelpers.convertGraphUsageData({
      data: graphData.usage,
      startDate,
      endDate,
      label: t('curiosity-graph.tooltipLabel', 'sockets on'),
      previousLabel: t('curiosity-graph.tooltipPreviousLabel', 'from previous day')
    });

    return (
      <Chart
        height={275}
        domainPadding={{ x: [30, 25] }}
        padding={{
          bottom: 75, // Adjusted to accommodate legend
          left: 50,
          right: 50,
          top: 50
        }}
        domain={chartDomain}
        width={chartWidth}
      >
        <ChartAxis tickValues={tickValues} fixLabelOverlap />
        <ChartAxis dependentAxis showGrid />
        <ChartStack>
          <ChartBar data={chartData} labelComponent={<ChartTooltip />} />
        </ChartStack>
      </Chart>
    );
  }

  render() {
    const { error, fulfilled, pending, t } = this.props;
    const { dateMenuIsExpanded, activeDateMenuOption } = this.state;

    return (
      <Card className="curiosity-usage-graph fadein">
        <CardHead>
          <h2>{t('curiosity-graph.heading', 'Daily CPU socket usage')}</h2>
          <CardActions>
            <Select
              aria-label={t('curiosity-graph.dropdownAriaLabel', 'Select Date Range')}
              onToggle={this.onToggle}
              onSelect={this.onSelect}
              selections={activeDateMenuOption}
              isExpanded={dateMenuIsExpanded}
              options={this.dateMenuOptions}
            />
          </CardActions>
        </CardHead>
        <CardBody>
          {/** todo: combine into a single class w/ --loading and BEM style */}
          <div className="curiosity-skeleton-container" ref={this.containerRef}>
            {pending && (
              <React.Fragment>
                <Skeleton size={SkeletonSize.xs} />
                <Skeleton size={SkeletonSize.sm} />
                <Skeleton size={SkeletonSize.md} />
                <Skeleton size={SkeletonSize.lg} />
              </React.Fragment>
            )}
            {(fulfilled || error) && this.renderChart()}
          </div>
        </CardBody>
      </Card>
    );
  }
}

RhelGraphCard.propTypes = {
  error: PropTypes.bool,
  fulfilled: PropTypes.bool,
  getGraphReports: PropTypes.func,
  graphData: PropTypes.shape({
    usage: PropTypes.array
  }),
  pending: PropTypes.bool,
  t: PropTypes.func,
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date)
};

RhelGraphCard.defaultProps = {
  error: false,
  fulfilled: false,
  getGraphReports: helpers.noop,
  graphData: {
    usage: []
  },
  pending: false,
  t: helpers.noopTranslate,
  startDate: dateHelpers.defaultDateTime.start,
  endDate: dateHelpers.defaultDateTime.end
};

const mapStateToProps = state => ({
  ...state.rhelGraph
});

const mapDispatchToProps = dispatch => ({
  getGraphReports: query => dispatch(reduxActions.rhel.getGraphReports(query))
});

const ConnectedRhelGraphCard = connectTranslate(mapStateToProps, mapDispatchToProps)(RhelGraphCard);

export { ConnectedRhelGraphCard as default, ConnectedRhelGraphCard, RhelGraphCard };
