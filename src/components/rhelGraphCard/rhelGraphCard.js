import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHead, CardActions, CardBody } from '@patternfly/react-core';
import { ChartThemeColor } from '@patternfly/react-charts';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components';
import { Select } from '../select/select';
import { connectTranslate, reduxActions, reduxSelectors, reduxTypes, store } from '../../redux';
import { helpers, dateHelpers, graphHelpers } from '../../common';
import { rhelApiTypes } from '../../types/rhelApiTypes';
import { rhelGraphCardTypes } from './rhelGraphCardTypes';
import ChartArea from '../chartArea/chartArea';

const GRANULARITY_TYPES = rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES;

class RhelGraphCard extends React.Component {
  componentDidMount() {
    this.onUpdateGraphData();
  }

  componentDidUpdate(prevProps) {
    const { graphGranularity } = this.props;

    if (graphGranularity !== prevProps.graphGranularity) {
      this.onUpdateGraphData();
    }
  }

  onUpdateGraphData = () => {
    const { getGraphCapacityRhel, getGraphReportsRhel, graphGranularity, startDate, endDate } = this.props;
    const submit = {
      [rhelApiTypes.RHSM_API_QUERY_GRANULARITY]: graphGranularity,
      [rhelApiTypes.RHSM_API_QUERY_START_DATE]: startDate.toISOString(),
      [rhelApiTypes.RHSM_API_QUERY_END_DATE]: endDate.toISOString()
    };

    getGraphCapacityRhel(submit);
    getGraphReportsRhel(submit);
  };

  onSelect = event => {
    const { graphGranularity } = this.props;
    const { value } = event;

    if (graphGranularity !== value) {
      store.dispatch({
        type: reduxTypes.rhel.SET_GRAPH_RHEL_GRANULARITY,
        graphGranularity: value
      });
    }
  };

  // ToDo: evaluate show error toast on chart error
  renderChart() {
    const { graphData, graphGranularity, t } = this.props;
    /*
    const { graphData, graphGranularity, startDate, endDate, t } = this.props;
    const {
      chartXAxisLabelIncrement,
      chartData,
      chartDataThresholds,
      chartDataHypervisor
    } = graphHelpers.convertChartData({
      data: graphData.usage,
      dataFacet: rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.SOCKETS,
      dataThreshold: graphData.capacity,
      dataThresholdFacet: rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.PHYSICAL_SOCKETS,
      tooltipLabel: t('curiosity-graph.tooltipSockets'),
      tooltipLabelNoData: t('curiosity-graph.tooltipSocketsNoData'),
      tooltipThresholdLabel: t('curiosity-graph.tooltipSocketsThreshold'),
      startDate,
      endDate,
      granularity: graphGranularity
    });
    */

    /*
    const convertChartData = (d = []) => {
      // debugger;
      const sockets = [];
      const socketsThreshold = [];
      const hypervisor = [];

      d.forEach(item => {
        // const yAxis = (data[stringDate] && data[stringDate].data) || 0;
        sockets.push({
          x: sockets.length,
          y: item.sockets,
          // date: item.date,
          // xAxisLabel: 'x axis',
          tooltip: 'No data'
        });

        socketsThreshold.push({
          x: socketsThreshold.length,
          y: item.socketsThreshold
          // date: item.date
        });

        hypervisor.push({
          x: hypervisor.length,
          y: item.hypervisor
          // date: item.date
        });
      });

      return {
        facets: {
          sockets,
          socketsThreshold,
          hypervisor
        }
      };
    };

    // const { facets } = convertChartData(graphData);
    const { facets } = convertChartData(graphData);
    */

    return (
      <ChartArea
        xAxisFixLabelOverlap
        xAxisLabelIncrement={graphHelpers.getChartXAxisLabelIncrement(graphGranularity)}
        xAxisTickFormat={({ tick, keys }) =>
          graphHelpers.xAxisTickFormat({
            tick,
            date: keys && keys.sockets && keys.sockets.date,
            granularity: graphGranularity
          })
        }
        yAxisTickFormat={({ tick }) => graphHelpers.yAxisTickFormat(tick)}
        tooltips={({ keys }) => {
          let hypervisor = keys.hypervisor && keys.hypervisor.y;
          let sockets = keys.sockets && keys.sockets.y;
          let threshold = keys.threshold && keys.threshold.y;

          hypervisor = (hypervisor && `${hypervisor} ${t('curiosity-graph.rhelTooltipHypervisor')}`) || '';
          sockets = (sockets && `${sockets} ${t('curiosity-graph.rhelTooltipSockets')}`) || '';
          threshold = (threshold && `${t('curiosity-graph.rhelTooltipThreshold')}: ${threshold}`) || '';

          const date =
            ((sockets ||
              hypervisor) &&
              `on ${graphHelpers.tooltipDate({
                date: keys.sockets.date,
                granularity: graphGranularity
              })}`) ||
            '';

          return `${threshold}\n${sockets} ${hypervisor}\n${date}`.trim() || t('curiosity-graph.tooltipNoData');
        }}
        /*
        tooltipsOLD={({ items }) => {
          let sockets = items.find(value => value.id === 'sockets').y;
          sockets =
            (sockets &&
              `${items.find(value => value.id === 'sockets').y} ${t('curiosity-graph.rhelTooltipSockets')}`) ||
            '';

          let threshold = items.find(value => value.id === 'threshold').y;
          threshold = (threshold && `${t('curiosity-graph.rhelTooltipThreshold')}: ${threshold}`) || '';

          let hypervisor = items.find(value => value.id === 'hypervisor').y;
          hypervisor = (hypervisor && `${hypervisor} ${t('curiosity-graph.rhelTooltipHypervisor')}`) || '';

          const date =
            (sockets &&
              hypervisor &&
              `on ${graphHelpers.tooltipDate({
                date: items.find(value => value.id === 'sockets').date,
                granularity: graphGranularity
              })}`) ||
            '';

          return `${threshold}\n${sockets} ${hypervisor}\n${date}`.trim() || t('curiosity-graph.tooltipNoData');
        }}
        */
        dataSets={[
          {
            data: graphData.sockets,
            id: 'sockets',
            animate: {
              duration: 250,
              onLoad: { duration: 250 }
            },
            legendLabel: t('curiosity-graph.rhelLegendSocketsLabel'),
            isStacked: true
          },
          {
            data: graphData.hypervisor,
            id: 'hypervisor',
            animate: {
              duration: 250,
              onLoad: { duration: 250 }
            },
            legendLabel: t('curiosity-graph.rhelLegendHypervisorLabel'),
            isStacked: true
          },
          {
            data: graphData.threshold,
            id: 'threshold',
            animate: {
              duration: 100,
              onLoad: { duration: 100 }
            },
            color: ChartThemeColor.green,
            legendLabel: t('curiosity-graph.rhelLegendThresholdLabel'),
            isThreshold: true
          }
        ]}
      />
    );
  }

  // ToDo: combine "curiosity-skeleton-container" into a single class w/ --loading and BEM style
  render() {
    const { graphGranularity, pending, t } = this.props;
    const getDateMenuOptions = rhelGraphCardTypes.getDateMenuOptions();

    return (
      <Card className="curiosity-usage-graph fadein">
        <CardHead>
          <h2>{t('curiosity-graph.heading', 'CPU socket usage')}</h2>
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
          <div className="curiosity-skeleton-container">
            {pending && (
              <React.Fragment>
                <Skeleton size={SkeletonSize.xs} />
                <Skeleton size={SkeletonSize.sm} />
                <Skeleton size={SkeletonSize.md} />
                <Skeleton size={SkeletonSize.lg} />
              </React.Fragment>
            )}
            {!pending && this.renderChart()}
          </div>
        </CardBody>
      </Card>
    );
  }
}

RhelGraphCard.propTypes = {
  getGraphCapacityRhel: PropTypes.func,
  getGraphReportsRhel: PropTypes.func,
  graphData: PropTypes.shape({
    sockets: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.instanceOf(Date),
        x: PropTypes.number,
        y: PropTypes.number
      })
    ),
    hypervisor: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.instanceOf(Date),
        x: PropTypes.number,
        y: PropTypes.number
      })
    ),
    threshold: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.instanceOf(Date),
        x: PropTypes.number,
        y: PropTypes.number
      })
    )
  }),
  /*
  graphDataOLD: PropTypes.shape({
    facets: PropTypes.arrayOf(
      PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number,
        tooltip: PropTypes.string,
        xAxisLabel: PropTypes.string,
        yAxisLabel: PropTypes.string
      })
    ),
    thresholds: PropTypes.arrayOf(
      PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number
      })
    )
  }),
   */
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
  getGraphCapacityRhel: helpers.noop,
  getGraphReportsRhel: helpers.noop,
  graphData: {
    sockets: [],
    hypervisor: [],
    threshold: []
  },
  graphGranularity: GRANULARITY_TYPES.DAILY,
  pending: false,
  t: helpers.noopTranslate,
  startDate: dateHelpers.defaultDateTime.startDate,
  endDate: dateHelpers.defaultDateTime.endDate
};

const makeMapStateToProps = () => {
  const getRhelGraphCard = reduxSelectors.graphCard.makeRhelGraphCard();

  return (state, props) => ({
    ...state.rhelGraph.component,
    ...getRhelGraphCard(state, props)
  });
};

const mapDispatchToProps = dispatch => ({
  getGraphCapacityRhel: query => dispatch(reduxActions.rhel.getGraphCapacityRhel(query)),
  getGraphReportsRhel: query => dispatch(reduxActions.rhel.getGraphReportsRhel(query))
});

const ConnectedRhelGraphCard = connectTranslate(makeMapStateToProps, mapDispatchToProps)(RhelGraphCard);

export { ConnectedRhelGraphCard as default, ConnectedRhelGraphCard, RhelGraphCard };
