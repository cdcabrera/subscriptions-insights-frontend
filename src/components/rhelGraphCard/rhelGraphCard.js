import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHead, CardActions, CardBody } from '@patternfly/react-core';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components';
import { Chart, ChartAxis, ChartBar, ChartStack, ChartTooltip } from '@patternfly/react-charts';
import { Select } from '../select/select';
import { connectTranslate, reduxActions, reduxTypes, store } from '../../redux';
import { helpers, dateHelpers, graphHelpers } from '../../common';
import { rhelApiTypes } from '../../types/rhelApiTypes';
import { rhelGraphCardTypes } from './rhelGraphCardTypes';

const GRANULARITY_TYPES = rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES;

class RhelGraphCard extends React.Component {
  state = { chartWidth: 0 };

  containerRef = React.createRef();

  componentDidMount() {
    this.onUpdateGraphData();
    this.onResizeContainer();
    window.addEventListener('resize', this.onResizeContainer);
  }

  componentDidUpdate(prevProps) {
    const { graphGranularity } = this.props;

    if (graphGranularity !== prevProps.graphGranularity) {
      this.onUpdateGraphData();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResizeContainer);
  }

  onUpdateGraphData = () => {
    const { getGraphReports, graphGranularity, startDate, endDate } = this.props;

    getGraphReports({
      [rhelApiTypes.RHSM_API_QUERY_GRANULARITY]: graphGranularity,
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

  onSelect = event => {
    const { value } = event;

    if (event) {
      store.dispatch({
        type: reduxTypes.rhel.SET_GRAPH_RHEL_GRANULARITY,
        graphGranularity: value
      });
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
          bottom: 80, // Adjusted to accommodate legend
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
    const { error, fulfilled, graphGranularity, pending, t } = this.props;
    const getDateMenuOptions = rhelGraphCardTypes.getDateMenuOptions();

    return (
      <Card className="curiosity-usage-graph fadein">
        <CardHead>
          <h2>{t('curiosity-graph.heading', 'Daily CPU socket usage')}</h2>
          <CardActions>
            <Select
              aria-label={t('curiosity-graph.dropdownPlaceholder', 'Select date range')}
              onSelect={this.onSelect}
              options={getDateMenuOptions}
              selectedOptions={graphGranularity}
              placeholder={t('curiosity-graph.dropdownPlaceholder', 'Select date range')}
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
  graphGranularity: PropTypes.oneOf([
    GRANULARITY_TYPES.DAILY,
    GRANULARITY_TYPES.WEEKLY,
    GRANULARITY_TYPES.MONTHLY,
    GRANULARITY_TYPES.QUARTERLY
  ]),
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
  graphGranularity: GRANULARITY_TYPES.DAILY,
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
