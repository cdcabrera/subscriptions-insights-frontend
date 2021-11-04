import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Button, Tooltip, TooltipPosition } from '@patternfly/react-core';
import { useMount } from 'react-use';
import { useProduct } from '../productView/productViewContext';
import { reduxTypes, storeHooks, store } from '../../redux';
import { helpers } from '../../common';
import { translate } from '../i18n/i18n';
import { ChartIcon } from '../chart/chartIcon';

/**
 * A custom chart legend.
 *
 * @fires onClick
 * @param {object} props
 * @param {object} props.chart
 * @param {object} props.datum
 * @param {Function} props.t
 * @param {Function} props.useDispatch
 * @param {Function} props.useProduct
 * @param {Function} props.useSelector
 * @returns {Node}
 */
const GraphCardChartLegend = ({
  chart,
  datum,
  t,
  useDispatch: useAliasDispatch,
  useProduct: useAliasProduct,
  useSelector: useAliasSelector
}) => {
  const { productLabel, viewId } = useAliasProduct();
  const [firstItem] = datum.dataSets || [];
  const { id: firstId } = firstItem || {};
  // const legend = useAliasSelector(({ graph }) => graph?.legend);
  const legend = useAliasSelector(({ legend: legendReducer }) => legendReducer.test?.[`${viewId}-${firstId}`]);
  /*
  const legend = useAliasSelector(({ legend }) => {
    const items = {};
    datum.dataSets.forEach(({ id }) => {
      items[`${viewId}-${id}`] = legend?.[`${viewId}-${id}`];
    });
    return {
      ...items
    };
  });
  */
  const dispatch = useAliasDispatch();

  useMount(() => {
    /*
    const checkIsToggled = legend || chart.isToggled(firstId);

    if (checkIsToggled) {
      chart.hide(firstId);
    }
    */
    /*
    datum.dataSets.forEach(({ id }) => {
      const checkIsToggled = legend?.[`${viewId}-${id}`] || chart.isToggled(id);

      if (checkIsToggled) {
        chart.hide(id);
      }
    });
    */
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
      // type: 'made up'
      type: reduxTypes.graph.SET_GRAPH_LEGEND,
      viewId: `${viewId}-${id}`,
      value: updatedToggle
      // legend: {
      //  [`${viewId}-${id}`]: updatedToggle
      // }
    });
  };

  return (
    <React.Fragment>
      {datum.dataSets.map(({ id, isThreshold, stroke: color, data = [] }) => {
        const isDisabled =
          !data.find(({ y, hasData }) => (y >= 0 && hasData === true) || (y >= 0 && isThreshold === true)) || false;

        const labelContent = t(
          [`curiosity-graph.label_${(isThreshold && 'threshold') || id}`, 'curiosity-graph.label_no'],
          {
            product: productLabel,
            context: productLabel
          }
        );

        const tooltipContent = t(
          `curiosity-graph.legendTooltip${(isThreshold && '_threshold') || ''}_${id}`,
          {
            product: productLabel,
            context: productLabel
          },
          [<span style={{ whiteSpace: 'nowrap' }} />]
        );

        // const checkIsToggled = legend?.[`${viewId}-${id}`] || chart.isToggled(id);
        const checkIsToggled = legend || chart.isToggled(id);

        const button = (
          <Button
            onClick={() => onClick(id)}
            onKeyPress={() => onClick(id)}
            className="curiosity-usage-graph__legend-item"
            tabIndex={0}
            key={`curiosity-button-${id}`}
            variant="link"
            component="a"
            isDisabled={isDisabled}
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
              distance={5}
            >
              {button}
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
 * @type {{datum: object, useProduct: Function, t: Function, useSelector: Function, useDispatch: Function, chart: object}}
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
        stroke: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        isThreshold: PropTypes.bool
      })
    )
  }),
  t: PropTypes.func,
  useDispatch: PropTypes.func,
  useProduct: PropTypes.func,
  useSelector: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{datum: object, useProduct: Function, t: Function, useSelector: Function, useDispatch: Function, chart: object}}
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
  useDispatch: storeHooks.reactRedux.useDispatch,
  useProduct,
  useSelector // storeHooks.reactRedux.useSelector
};

export { GraphCardChartLegend as default, GraphCardChartLegend };
