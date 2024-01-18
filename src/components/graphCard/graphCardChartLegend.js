import React from 'react';
import PropTypes from 'prop-types';
import { Button, Tooltip, TooltipPosition } from '@patternfly/react-core';
import { useMount } from 'react-use';
import { useProduct } from '../productView/productViewContext';
import { useGraphCardContext } from './graphCardContext';
import { reduxTypes, storeHooks } from '../../redux';
import { helpers } from '../../common';
import { translate } from '../i18n/i18n';
import { ChartIcon } from '../chart/chartIcon';

/**
 * @memberof GraphCard
 * @module GraphCardChartLegend
 */

/**
 * FixMe: PF button disabled borks events on immediate parent nodes, such as tooltip wrappers
 * PF is using "pointer-events: none" styling when disabled is activated. This
 * currently affects events on immediate parent nodes.
 */
/**
 * A custom chart legend.
 *
 * @fires onClick
 * @param {object} props
 * @param {object} props.chart
 * @param {object} props.datum
 * @param {Function} props.t
 * @param {Function} props.useDispatch
 * @param {Function} props.useGraphCardContext
 * @param {Function} props.useProduct
 * @param {Function} props.useSelectors
 * @returns {React.ReactNode}
 */
const GraphCardChartLegend = ({
  chart,
  datum,
  t,
  useDispatch: useAliasDispatch,
  useGraphCardContext: useAliasGraphCardContext,
  useSelectors: useAliasSelectors,
  useProduct: useAliasProduct
}) => {
  const { settings = {} } = useAliasGraphCardContext();
  const { productLabel, viewId } = useAliasProduct();
  const { isDisabledLegendClick } = settings;

  const dispatch = useAliasDispatch();
  const [invertedLegendItem, ...legendItems] = useAliasSelectors([
    `${reduxTypes.graph.SET_GRAPH_LEGEND}-${viewId}-inverted`,
    ...datum.dataSets.map(({ id }) => `${reduxTypes.graph.SET_GRAPH_LEGEND}-${viewId}-${id}`)
  ]);

  console.log('>>>>>>>>> LEGEND', invertedLegendItem);
  console.log('>>>>>>>>> LEGEND', legendItems);

  useMount(() => {
    datum.dataSets.forEach(({ id, isToolbarFilter }, index) => {
      if (invertedLegendItem?.value && isToolbarFilter) {
        if (!new RegExp(invertedLegendItem.value).test(id)) {
          chart.hide(id);
        }
      } else {
        // const checkIsToggled = legendItems?.[index] || chart.isToggled(id);
        // const checkIsToggled = legendItems?.[index]?.id === id && legendItems?.[index]?.value || chart.isToggled(id);
        const checkIsToggled = legendItems?.[index]?.value || chart.isToggled(id);

        if (checkIsToggled) {
          chart.hide(id);
        }
      }
    });
  });

  /**
   * Toggle legend item and chart.
   *
   * @event onClick
   * @param {string} id
   */
  const onClick = id => {
    const updatedToggle = chart.toggle(id);

    dispatch({
      dynamicType: `${reduxTypes.graph.SET_GRAPH_LEGEND}-${viewId}-${id}`,
      id: `${viewId}-${id}`,
      value: updatedToggle
    });
  };

  return (
    <React.Fragment>
      {datum.dataSets.map(({ id, isThreshold, stroke: color, data = [] }, index) => {
        const isDisabled =
          !data.find(({ y, hasData }) => (y >= 0 && hasData === true) || (y >= 0 && isThreshold === true)) || false;

        const labelContent = t([`curiosity-graph.label`, 'curiosity-graph.label_no'], {
          product: productLabel,
          context: id
        });

        const tooltipContent = t(
          `curiosity-graph.legendTooltip`,
          {
            product: productLabel,
            context: id
          },
          [<span style={{ whiteSpace: 'nowrap' }} />]
        );

        const checkIsToggled = legendItems?.[index]?.value || chart.isToggled(id);
        const buttonActionProps = {};

        if (!isDisabledLegendClick) {
          buttonActionProps.onClick = () => onClick(id);
          buttonActionProps.onKeyPress = () => onClick(id);
        }

        const button = (
          <Button
            {...buttonActionProps}
            className="curiosity-graph__legend-item curiosity-usage-graph__legend-item"
            tabIndex={0}
            key={`curiosity-button-${id}`}
            variant="link"
            component="a"
            isDisabled={isDisabledLegendClick ?? isDisabled}
            icon={
              ((isDisabled || checkIsToggled) && <ChartIcon symbol="eyeSlash" />) || (
                <ChartIcon
                  symbol={(isThreshold && 'dash') || 'square'}
                  style={{ visibility: (isDisabled && 'hidden') || (checkIsToggled && 'hidden') || 'visible' }}
                  fill={color}
                />
              )
            }
          >
            {labelContent}
          </Button>
        );

        if (tooltipContent) {
          return (
            <Tooltip
              key={`curiosity-tooltip-${id}`}
              content={<p>{tooltipContent}</p>}
              position={TooltipPosition.top}
              enableFlip
            >
              <span className="pf-c-button pf-m-link curiosity-graph__legend-item-wrapper curiosity-usage-graph__legend-item-wrapper">
                {button}
              </span>
            </Tooltip>
          );
        }

        return button;
      })}
    </React.Fragment>
  );
};

/**
 * Prop types.
 *
 * @type {{datum: object, useProduct: Function, t: Function, useGraphCardContext: Function, useDispatch: Function,
 *     useSelectors: Function, chart: object}}
 */
GraphCardChartLegend.propTypes = {
  chart: PropTypes.shape({
    hide: PropTypes.func,
    toggle: PropTypes.func,
    isToggled: PropTypes.func
  }),
  datum: PropTypes.shape({
    dataSets: PropTypes.arrayOf(
      PropTypes.shape({
        data: PropTypes.array,
        id: PropTypes.string.isRequired,
        isThreshold: PropTypes.bool,
        stroke: PropTypes.string.isRequired
      })
    )
  }),
  t: PropTypes.func,
  useDispatch: PropTypes.func,
  useGraphCardContext: PropTypes.func,
  useProduct: PropTypes.func,
  useSelectors: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{datum: {dataSets: Array}, useProduct: Function, t: Function, useGraphCardContext: Function,
 *     useDispatch: Function, useSelectors: Function, chart: {hide: Function, toggle: Function, isToggled: Function}}}
 */
GraphCardChartLegend.defaultProps = {
  chart: {
    hide: helpers.noop,
    toggle: helpers.noop,
    isToggled: helpers.noop
  },
  datum: {
    dataSets: []
  },
  t: translate,
  useDispatch: storeHooks.reactRedux.useDynamicDispatch,
  useGraphCardContext,
  useProduct,
  useSelectors: storeHooks.reactRedux.useDynamicSelectors
};

export { GraphCardChartLegend as default, GraphCardChartLegend };
