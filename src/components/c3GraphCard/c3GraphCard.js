import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHead, CardActions, CardBody, Button, Tooltip, TooltipPosition } from '@patternfly/react-core';
import { chart_color_green_300 as chartColorGreenDark } from '@patternfly/react-tokens';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components/components/Skeleton';
import _isEqual from 'lodash/isEqual';
import moment from 'moment';
import numbro from 'numbro';
import { Select } from '../form/select';
import { connectTranslate, reduxActions, reduxSelectors, reduxTypes, store } from '../../redux';
import { helpers, dateHelpers } from '../../common';
import { rhsmApiTypes, RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES } from '../../types/rhsmApiTypes';
import { graphCardHelpers } from '../graphCard/graphCardHelpers';
import { graphCardTypes } from '../graphCard/graphCardTypes';
import { C3Chart } from '../c3Chart/c3Chart';

/**
 * A chart/graph card.
 *
 * @augments React.Component
 * @fires onUpdateGraphData
 * @fires onGranularitySelect
 */
class C3GraphCard extends React.Component {
  componentDidMount() {
    this.onUpdateGraphData();
  }

  componentDidUpdate(prevProps) {
    const { graphQuery, productId } = this.props;

    if (productId !== prevProps.productId || !_isEqual(graphQuery, prevProps.graphQuery)) {
      this.onUpdateGraphData();
    }
  }

  /**
   * Call the RHSM APIs, apply filters.
   *
   * @event onUpdateGraphData
   */
  onUpdateGraphData = () => {
    const { getGraphReportsCapacity, graphQuery, isDisabled, productId } = this.props;
    const graphGranularity = graphQuery && graphQuery[rhsmApiTypes.RHSM_API_QUERY_GRANULARITY];

    if (!isDisabled && graphGranularity && productId) {
      const { startDate, endDate } = dateHelpers.getRangedDateTime(graphGranularity);
      const query = {
        [rhsmApiTypes.RHSM_API_QUERY_START_DATE]: startDate.toISOString(),
        [rhsmApiTypes.RHSM_API_QUERY_END_DATE]: endDate.toISOString(),
        ...graphQuery
      };

      getGraphReportsCapacity(productId, query);
    }
  };

  /**
   * On granularity select, dispatch granularity type.
   *
   * @event onGranularitySelect
   * @param {object} event
   */
  onGranularitySelect = (event = {}) => {
    const { value } = event;
    const { viewId } = this.props;

    store.dispatch({
      type: reduxTypes.rhsm.SET_GRAPH_GRANULARITY_RHSM,
      viewId,
      [rhsmApiTypes.RHSM_API_QUERY_GRANULARITY]: value
    });
  };

  /**
   * FixMe: custom use of dash over threshold vs updating PF Charts legend threshold symbol
   *
   * patternfly/react-tokens chart_threshold_stroke_dash_array and chart_threshold_stroke_Width
   */
  /**
   * Apply props to chart/graph.
   *
   * @returns {Node}
   */
  renderChart() {
    const { filterGraphData, graphData, graphQuery, selectOptionsType, t, productShortLabel } = this.props;

    const graphGranularity = graphQuery && graphQuery[rhsmApiTypes.RHSM_API_QUERY_GRANULARITY];
    const { selected } = graphCardTypes.getGranularityOptions(selectOptionsType);
    const updatedGranularity = graphGranularity || selected;

    const filtered = {};
    const converted = {
      x: 'x',
      columns: [],
      names: {},
      types: {},
      groups: [[]],
      colors: {}
      // tooltipTitle: []
    };

    const xAxisLabelIncrement = graphCardHelpers.getChartXAxisLabelIncrement(updatedGranularity);

    const xAxisTickFormat = ({ tick }) => {
      const formattedDate = moment.utc(tick).local().format('YYYY-MM-DD');
      const dateIndex = converted.columns[0].slice(1).indexOf(formattedDate);
      const previousDate = dateIndex > -1 && converted.columns[0][dateIndex - 1];

      return graphCardHelpers.xAxisTickFormat({
        tick: dateIndex,
        date: formattedDate,
        previousDate,
        granularity: updatedGranularity
      });
    };

    const yAxisTickFormat = ({ tick }) => numbro(tick).format({ average: true, mantissa: 1, optionalMantissa: true });

    if (!graphData || !Object.values(graphData).length) {
      return null;
    }

    if (filterGraphData.length) {
      filterGraphData.forEach(value => {
        filtered[value.id] = graphData[value.id];

        if (/^threshold/.test(value.id)) {
          converted.colors[value.id] = chartColorGreenDark.value;
        } else {
          converted.colors[value.id] = value.stroke;
        }
      });
    } else {
      Object.assign(filtered, { ...graphData });
    }

    Object.keys(filtered).forEach(value => {
      if (/^threshold/.test(value)) {
        converted.types[value] = 'step';
        converted.names[value] = t(`curiosity-graph.thresholdLabel`);
      } else {
        converted.types[value] = 'area-spline';
        converted.groups[0].push(value);
        converted.names[value] = t(`curiosity-graph.${value}Label`, { product: productShortLabel });
      }

      converted.columns[0] = ['x'];
      converted.columns.push([value]);

      filtered[value].forEach(filteredValue => {
        const formattedDate = moment.utc(filteredValue.date).local().format('YYYY-MM-DD');
        converted.columns[0].push(formattedDate);
        converted.columns[converted.columns.length - 1].push(filteredValue.y);
      });
    });

    const onComplete = ({ chart }) => {
      console.log('ON COMPLETE >>>', chart);
    };

    return (
      <C3Chart
        key={`chart-${updatedGranularity}`}
        onComplete={onComplete}
        config={{
          unloadBeforeLoad: true,
          padding: { left: 30, right: 30 },
          legend: { show: false },
          spline: {
            interpolation: {
              type: 'monotone'
            }
          },
          data: {
            ...converted
          },
          grid: {
            y: {
              show: true
            }
          },
          axis: {
            x: {
              type: 'timeseries',
              tick: {
                culling: {
                  // min: xAxisLabelIncrement
                },
                // fit: true,
                format: tick => xAxisTickFormat({ tick })
                // rotate: 75,
                // multiline: true
              },
              padding: 0
            },
            y: {
              tick: {
                // count: 1,
                outer: false,
                format: tick => (tick === 0 ? '' : yAxisTickFormat({ tick }))
              }
              // padding: { bottom: 10 }
            }
          }
        }}
      >
        {({ chart }) =>
          Object.keys(filtered).map(productDataFacet => {
            const buttonLabel =
              (/^threshold/.test(productDataFacet) && t(`curiosity-graph.thresholdLabel`)) ||
              t(`curiosity-graph.${productDataFacet}Label`, { product: productShortLabel });

            const tooltip = (
              <ul>
                <li>hello</li>
                <li>world</li>
              </ul>
            );

            return (
              <Tooltip
                key={`curiosity-tooltip-${buttonLabel}`}
                content={tooltip}
                position={TooltipPosition.top}
                distance={-10}
                entryDelay={100}
                exitDelay={0}
              >
                <Button
                  tabIndex={0}
                  key={buttonLabel}
                  variant="link"
                  onClick={() => chart.toggle(productDataFacet)}
                  onFocus={() => chart.focus(productDataFacet)}
                  onMouseOver={() => chart.focus(productDataFacet)}
                  onBlur={() => chart.revert()}
                  onMouseOut={() => chart.revert()}
                  component="a"
                >
                  <div
                    style={{
                      backgroundColor: chart.color(productDataFacet),
                      verticalAlign: 'baseline',
                      width: '10px',
                      height: '10px',
                      display: 'inline-block'
                    }}
                  />{' '}
                  {buttonLabel}
                </Button>
              </Tooltip>
            );
          })
        }
      </C3Chart>
    );
  }

  /**
   * Render a chart/graph card with chart/graph.
   *
   * @returns {Node}
   */
  render() {
    const { cardTitle, children, error, graphQuery, isDisabled, selectOptionsType, pending, t } = this.props;

    if (isDisabled) {
      return null;
    }

    const { options } = graphCardTypes.getGranularityOptions(selectOptionsType);
    const graphGranularity = graphQuery && graphQuery[rhsmApiTypes.RHSM_API_QUERY_GRANULARITY];

    return (
      <Card className="curiosity-usage-graph fadein">
        <CardHead>
          <h2>{cardTitle}</h2>
          <CardActions>
            {children}
            <Select
              aria-label={t('curiosity-graph.dropdownPlaceholder')}
              onSelect={this.onGranularitySelect}
              options={options}
              selectedOptions={graphGranularity}
              placeholder={t('curiosity-graph.dropdownPlaceholder')}
            />
          </CardActions>
        </CardHead>
        <CardBody>
          <div className={`curiosity-skeleton-container ${(error && 'blur') || ''}`}>
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

/**
 * Prop types.
 *
 * @type {{productId: string, pending: boolean, error: boolean, graphQuery: object, cardTitle: string,
 *     filterGraphData: Array, getGraphReportsCapacity: Function, productShortLabel: string, selectOptionsType: string,
 *     viewId: string, t: Function, children: Node, graphData: object, isDisabled: boolean}}
 */
C3GraphCard.propTypes = {
  cardTitle: PropTypes.string,
  children: PropTypes.node,
  error: PropTypes.bool,
  filterGraphData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      fill: PropTypes.string,
      stroke: PropTypes.string
    })
  ),
  getGraphReportsCapacity: PropTypes.func,
  graphData: PropTypes.object,
  graphQuery: PropTypes.shape({
    [rhsmApiTypes.RHSM_API_QUERY_GRANULARITY]: PropTypes.oneOf([...Object.values(GRANULARITY_TYPES)]).isRequired
  }).isRequired,
  isDisabled: PropTypes.bool,
  pending: PropTypes.bool,
  productId: PropTypes.string.isRequired,
  selectOptionsType: PropTypes.oneOf(['default']),
  t: PropTypes.func,
  productShortLabel: PropTypes.string,
  viewId: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{getGraphReportsCapacity: Function, productShortLabel: string, selectOptionsType: string,
 *     viewId: string, t: Function, children: null, pending: boolean, graphData: object,
 *     isDisabled: boolean, error: boolean, cardTitle: null, filterGraphData: Array}}
 */
C3GraphCard.defaultProps = {
  cardTitle: null,
  children: null,
  error: false,
  filterGraphData: [],
  getGraphReportsCapacity: helpers.noop,
  graphData: {},
  isDisabled: helpers.UI_DISABLED_GRAPH,
  pending: false,
  selectOptionsType: 'default',
  t: helpers.noopTranslate,
  productShortLabel: '',
  viewId: 'graphCard'
};

/**
 * Create a selector from applied state, props.
 *
 * @type {Function}
 */
const makeMapStateToProps = reduxSelectors.graphCard.makeGraphCard();

/**
 * Apply actions to props.
 *
 * @param {Function} dispatch
 * @returns {object}
 */
const mapDispatchToProps = dispatch => ({
  getGraphReportsCapacity: (id, query) => dispatch(reduxActions.rhsm.getGraphReportsCapacity(id, query))
});

const ConnectedGraphCard = connectTranslate(makeMapStateToProps, mapDispatchToProps)(C3GraphCard);

export { ConnectedGraphCard as default, ConnectedGraphCard, C3GraphCard };
