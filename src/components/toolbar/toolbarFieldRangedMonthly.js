import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { reduxTypes, store, useSelector } from '../../redux';
import { Select } from '../form/select';
import { RHSM_API_QUERY_GRANULARITY_TYPES as FIELD_TYPES, RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';
import { dateHelpers } from '../../common';
import { translate } from '../i18n/i18n';

const toolbarFieldOptionsSearch = dateHelpers.getRangedMonthDateTime().keyDateTimeRanges;

/**
 * Select field options.
 *
 * @type {{title: (string|Node), value: string, selected: boolean}[]}
 */
const toolbarFieldOptions = dateHelpers.getRangedMonthDateTime().listDateTimeRanges.map(({ title, _title }) => ({
  title,
  value: _title,
  selected: false
}));

/**
 * Display a granularity field with options.
 *
 * @fires onSelect
 * @param {object} props
 * @param {Array} props.options
 * @param {Function} props.t
 * @param {string} props.value
 * @param {string} props.viewId
 * @returns {Node}
 */
const ToolbarFieldRangedMonthly = ({ options, t, value, viewId }) => {
  const updatedValue = useSelector(
    ({ view }) => view.graphTallyQuery?.[viewId]?.[RHSM_API_QUERY_TYPES.START_DATE],
    value
  );

  const updatedOptions = options.map(option => ({
    ...option,
    selected: option.title === updatedValue || option.value === moment.utc(updatedValue).format('MMMM').toLowerCase()
  }));

  /**
   * On select, dispatch type.
   *
   * @event onSelect
   * @param {object} event
   * @returns {void}
   */
  const onSelect = event => {
    const { startDate, endDate } = toolbarFieldOptionsSearch?.[event.value]?.value || {};
    store.dispatch([
      {
        type: reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.GRANULARITY],
        viewId,
        [RHSM_API_QUERY_TYPES.GRANULARITY]: FIELD_TYPES.DAILY
      },
      {
        type: reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.START_DATE],
        viewId,
        [RHSM_API_QUERY_TYPES.START_DATE]: startDate
      },
      {
        type: reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.END_DATE],
        viewId,
        [RHSM_API_QUERY_TYPES.END_DATE]: endDate
      }
    ]);
  };

  return (
    <Select
      aria-label={t('curiosity-toolbar.placeholder', { context: 'granularity' })}
      onSelect={onSelect}
      options={updatedOptions}
      selectedOptions={updatedValue}
      placeholder={t('curiosity-toolbar.placeholder', { context: 'granularity' })}
      maxHeight={250}
    />
  );
};

/**
 * Prop types.
 *
 * @type {{viewId: string, t: Function, options: Array, value: string}}
 */
ToolbarFieldRangedMonthly.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.node,
      value: PropTypes.any,
      selected: PropTypes.bool
    })
  ),
  t: PropTypes.func,
  value: PropTypes.string,
  viewId: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{viewId: string, t: translate, options: Array, value: string}}
 */
ToolbarFieldRangedMonthly.defaultProps = {
  options: toolbarFieldOptions,
  t: translate,
  value: translate('curiosity-toolbar.granularityRange', { context: 'current' }),
  viewId: 'toolbarFieldRangeGranularity'
};

export { ToolbarFieldRangedMonthly as default, ToolbarFieldRangedMonthly, toolbarFieldOptions };
