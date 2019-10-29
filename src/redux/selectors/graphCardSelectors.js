import { createSelector } from 'reselect';
import moment from 'moment';
import _get from 'lodash/get';
import { rhelApiTypes } from '../../types/rhelApiTypes';
import { graphHelpers } from '../../common';
import { translate } from '../../components/i18n/i18n';

const rhelGraphCardCache = {};

const rhelGraph = state => state.rhelGraph;

const rhelGraphCardSelector = createSelector(
  [rhelGraph],
  rhelGraphReducer => {
    const { capacity = {}, report = {} } = rhelGraphReducer || {};
    const reportMetaQuery = _get(report, ['metaQuery'], {});
    const capacityMetaQuery = _get(capacity, ['metaQuery'], {});

    const reportGranularity = _get(reportMetaQuery, [rhelApiTypes.RHSM_API_QUERY_GRANULARITY]);
    const capacityGranularity = _get(capacityMetaQuery, [rhelApiTypes.RHSM_API_QUERY_GRANULARITY]);
    const granularity = reportGranularity || capacityGranularity || null;
    const cachedGranularity = (granularity && rhelGraphCardCache[granularity]) || {};
    const initialLoad = typeof cachedGranularity.initialLoad === 'boolean' ? cachedGranularity.initialLoad : true;

    const updatedData = {
      error: false,
      fulfilled: false,
      pending: false,
      initialLoad,
      graphData: {
        sockets: [],
        hypervisor: [],
        threshold: []
      },
      ...cachedGranularity
    };

    if (granularity === null) {
      updatedData.error = true;
      return updatedData;
    }

    if (initialLoad) {
      updatedData.error = report.error || capacity.error || false;
      updatedData.pending = report.pending || capacity.pending || false;
    }

    if (capacity.fulfilled && report.fulfilled && granularity) {
      const products = _get(report, ['data', rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA], []);
      const threshold = _get(capacity, ['data', rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA], []);
      const aggregatedData = {
        sockets: [],
        hypervisor: [],
        threshold: []
      };

      products.forEach((value, index) => {
        if (value) {
          const date = moment
            .utc(value[rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.DATE])
            .startOf('day')
            .toDate();

          /**
           * FixMe: per API the list indexes should match on capacity and reporting.
           * Once reasonable testing has occurred consider removing this check.
           */
          const checkThresholdDate = item => {
            if (!item) {
              return false;
            }

            const itemDate = moment
              .utc(item[rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.DATE])
              .startOf('day')
              .toDate();

            return moment(date).isSame(itemDate);
          };

          aggregatedData.sockets.push({
            date,
            x: index,
            y: Number.parseInt(value[rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.PHYSICAL_SOCKETS], 10)
            // xAxisLabel: date
          });

          aggregatedData.hypervisor.push({
            date,
            x: index,
            y: Number.parseInt(value[rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HYPERVISOR_SOCKETS], 10)
          });

          aggregatedData.threshold.push({
            date,
            x: index,
            y: Number.parseInt(
              (checkThresholdDate(threshold && threshold[index]) &&
                threshold[index][rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.SOCKETS]) ||
                0,
              10
            )
          });
        }
      });

      console.log('AGGREGATED', products, threshold, aggregatedData);
      updatedData.graphData = aggregatedData;
      updatedData.initialLoad = false;
      updatedData.fulfilled = true;

      if (reportGranularity === capacityGranularity) {
        rhelGraphCardCache[granularity] = { ...updatedData };
      }
    }

    return updatedData;
  }
);

const makeRhelGraphCardSelector = () => rhelGraphCardSelector;

const graphCardSelectors = {
  rhelGraphCard: rhelGraphCardSelector,
  makeRhelGraphCard: makeRhelGraphCardSelector
};

export { graphCardSelectors as default, graphCardSelectors, rhelGraphCardSelector, makeRhelGraphCardSelector };
