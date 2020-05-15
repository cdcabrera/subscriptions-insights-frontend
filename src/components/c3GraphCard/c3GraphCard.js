import React from 'react';
import PropTypes from 'prop-types';
import { EyeSlashIcon } from '@patternfly/react-icons';
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
import { c3GraphCardHelpers } from './c3GraphCardHelpers';
import { graphCardTypes } from '../graphCard/graphCardTypes';
import { C3Chart } from '../c3Chart/c3Chart';
import { translate } from '../i18n/i18n';

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

    const filtered = [];
    const hiddenDataFacets = [];
    const converted = {
      x: 'x',
      colors: {},
      columns: [],
      groups: [[]],
      // hide: [],
      names: {},
      types: {}
      // tooltipTitle: []
    };

    // const xAxisLabelIncrement = graphCardHelpers.getChartXAxisLabelIncrement(updatedGranularity);

    const xAxisTickFormat = ({ tick }) => {
      const formattedDate = moment.utc(tick).local().format('YYYY-MM-DD');
      const dateIndex = converted.columns[0].slice(1).indexOf(formattedDate);
      const previousDate = dateIndex > -1 && converted.columns[0][dateIndex - 1];

      return c3GraphCardHelpers.xAxisTickFormat({
        tick: dateIndex,
        date: formattedDate,
        previousDate,
        granularity: updatedGranularity
      });
    };

    if (!graphData || !Object.values(graphData).length) {
      return null;
    }

    if (filterGraphData.length) {
      filterGraphData.forEach(value => {
        if (graphData[value.id]) {
          filtered.push({ id: value.id, data: [...graphData[value.id]] });

          if (/^threshold/.test(value.id)) {
            converted.colors[value.id] = chartColorGreenDark.value;
          } else {
            converted.colors[value.id] = value.stroke;
          }
        }
      });
    } else {
      Object.keys(graphData).forEach(id => {
        filtered.push({ id, data: [...graphData[id]] });
      });
    }

    console.log('CHECK >>>', filtered);

    filtered.forEach(value => {
      if (/^threshold/.test(value.id)) {
        converted.types[value.id] = 'step';
        converted.names[value.id] = t(`curiosity-graph.thresholdLabel`);
      } else {
        converted.types[value.id] = 'area-spline';
        converted.groups[0].push(value.id);
        converted.names[value.id] = t(`curiosity-graph.${value.id}Label`, { product: productShortLabel });
      }

      converted.columns[0] = ['x'];
      converted.columns.push([value.id]);

      let totalData = 0;

      value.data.forEach(filteredValue => {
        converted.columns[0].push(moment.utc(filteredValue.date).local().format('YYYY-MM-DD'));
        converted.columns[converted.columns.length - 1].push(filteredValue.y);
        totalData += filteredValue.y || 0;
      });

      if (totalData <= 0) {
        converted.columns.pop();
        hiddenDataFacets.push(value.id);
      }
    });

    const onComplete = ({ chart }) => {
      console.log('ON COMPLETE >>>', chart, converted);
    };

    return (
      <C3Chart
        key={`chart-${updatedGranularity}`}
        onComplete={onComplete}
        config={{
          tooltip: {
            order: (t1, t2) => converted.columns.indexOf(t1.id) - converted.columns.indexOf(t2.id),
            format: {
              title: x =>
                `${c3GraphCardHelpers.getTooltipDate({
                  date: x,
                  granularity: updatedGranularity
                })}`,
              value: (value, ratio, id, index) => {
                console.log('TOOLTIP >>>', value, ratio, id, index, graphData[id][index]);
                const dataItem = graphData[id][index];
                let updatedValue;

                if (/^threshold/.test(id)) {
                  updatedValue =
                    (dataItem.hasInfinite && t('curiosity-graph.infiniteThresholdLabel')) ||
                    (dataItem.y ?? t('curiosity-graph.noDataLabel'));
                } else {
                  updatedValue = (dataItem.hasData === false && t('curiosity-graph.noDataLabel')) || dataItem.y || 0;
                }

                return updatedValue;
              }
            }
          },
          unloadBeforeLoad: true,
          padding: { left: 40, right: 40, top: 10, bottom: 10 },
          legend: { show: false },
          spline: {
            interpolation: {
              type: 'monotone'
            }
          },
          data: {
            ...converted
          },
          point: {
            show: false
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
              // show: hiddenDataFacets.length !== Object.keys(filtered).length, // acts wonky when some products have data
              default: [0, 50],
              padding: { bottom: 0 },
              min: 0,
              tick: {
                // count: 1,
                show: false,
                outer: false,
                format: tick => (tick === 0 ? '' : c3GraphCardHelpers.yAxisTickFormat({ tick }))
              }
              // padding: { bottom: 10 }
            }
          }
        }}
      >
        {({ chart }) =>
          filtered.map(({ id }) => {
            const buttonLabel =
              (/^threshold/.test(id) && t(`curiosity-graph.thresholdLabel`)) ||
              t(`curiosity-graph.${id}Label`, { product: productShortLabel });

            const tooltip = (
              <p>
                {(/^threshold/.test(id) && t(`curiosity-graph.thresholdLegendTooltip`)) ||
                  t(`curiosity-graph.${id}LegendTooltip`)}
              </p>
            );

            // const isDataHidden = converted.hide.includes(productDataFacet);
            const isDataHidden = hiddenDataFacets.includes(id);
            // let isDataToggledOff = false;
            // const { [`${id}Toggle`] } = this.state;
            const isDataToggledOff = this.state?.[`${id}Toggle`] || false;
            // const isDataToggledOff = [`${id}Toggle`];

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
                  onClick={() => {
                    chart.toggle(id);
                    // console.log('TOGGLE', isDataToggledOff);
                    this.setState({ [`${id}Toggle`]: !isDataToggledOff });
                  }}
                  onFocus={() => chart.focus(id)}
                  onMouseOver={() => chart.focus(id)}
                  onBlur={() => chart.revert()}
                  onMouseOut={() => chart.revert()}
                  component="a"
                  // className={(isDataHidden && 'faded') || ''}
                  isDisabled={isDataHidden}
                  icon={
                    ((isDataHidden || isDataToggledOff) && <EyeSlashIcon />) ||
                    (/^threshold/.test(id) && (
                      <hr
                        aria-hidden
                        className="threshold-legend-icon"
                        style={{
                          visibility: (isDataHidden && 'hidden') || (isDataToggledOff && 'hidden') || 'visible',
                          borderTopColor: chart.color(id)
                        }}
                      />
                    )) || (
                      <div
                        aria-hidden
                        className="legend-icon"
                        style={{
                          visibility: (isDataHidden && 'hidden') || (isDataToggledOff && 'hidden') || 'visible',
                          backgroundColor: chart.color(id)
                        }}
                      />
                    )
                  }
                >
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
