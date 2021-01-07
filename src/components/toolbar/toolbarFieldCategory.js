import React from 'react';
import PropTypes from 'prop-types';
import { reduxTypes, store, useSelector } from '../../redux';
import { Select } from '../form/select';
import { RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';
import { translate } from '../i18n/i18n';

/**
 * Select field options.
 *
 * @type {{title: (string|Node), value: string, selected: boolean}[]}
 */
const toolbarFieldOptions = [
  {
    title: translate('curiosity-toolbar.category', { context: RHSM_API_QUERY_TYPES.SLA }),
    value: RHSM_API_QUERY_TYPES.SLA,
    selected: false
  },
  {
    title: translate('curiosity-toolbar.category', { context: RHSM_API_QUERY_TYPES.USAGE }),
    value: RHSM_API_QUERY_TYPES.USAGE,
    selected: false
  }
];

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
const ToolbarFieldCategory = ({ options, t, value, viewId }) => {
  const updatedValue = useSelector(({ toolbar }) => toolbar.filters?.[viewId]?.currentFilter, value);
  const updatedOptions = options.map(option => ({ ...option, selected: option.value === updatedValue }));

  /**
   * On select, dispatch type.
   *
   * @event onSelect
   * @param {object} event
   * @returns {void}
   */
  const onSelect = (event = {}) =>
    store.dispatch({
      type: reduxTypes.toolbar.SET_FILTER_TYPE,
      viewId,
      currentFilter: event.value
    });

  return (
    <Select
      aria-label={t('curiosity-toolbar.category')}
      onSelect={onSelect}
      options={updatedOptions}
      selectedOptions={updatedValue}
      placeholder={t('curiosity-toolbar.placeholder')}
    />
  );
};

/**
 * Prop types.
 *
 * @type {{viewId: string, t: Function, options: Array, value: string}}
 */
ToolbarFieldCategory.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.node,
      value: PropTypes.any,
      selected: PropTypes.bool
    })
  ),
  t: PropTypes.func,
  value: PropTypes.oneOf([RHSM_API_QUERY_TYPES.SLA, RHSM_API_QUERY_TYPES.USAGE]),
  viewId: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{viewId: string, t: translate, options: Array, value: string}}
 */
ToolbarFieldCategory.defaultProps = {
  options: toolbarFieldOptions,
  t: translate,
  value: null,
  viewId: 'toolbarFieldCategories'
};

export { ToolbarFieldCategory as default, ToolbarFieldCategory, toolbarFieldOptions };
