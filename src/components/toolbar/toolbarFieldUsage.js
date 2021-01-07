import React from 'react';
import PropTypes from 'prop-types';
import { reduxTypes, store, useSelector } from '../../redux';
import { Select } from '../form/select';
import { RHSM_API_QUERY_USAGE_TYPES as FIELD_TYPES, RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';
import { translate } from '../i18n/i18n';
import { toolbarFieldOptions as categoryOptions } from './toolbarFieldCategory';

/**
 * Select field options.
 *
 * @type {{title: (string|Node), value: string, selected: boolean}[]}
 */
const toolbarFieldOptions = Object.values(FIELD_TYPES).map(type => ({
  title: translate('curiosity-toolbar.usage', { context: (type === '' && 'Unspecified') || type }),
  value: type,
  selected: false
}));

/**
 * Display a usage field with options.
 *
 * @fires onSelect
 * @param {object} props
 * @param {object} props.options
 * @param {Function} props.t
 * @param {string} props.value
 * @param {string} props.viewId
 * @returns {Node}
 */
const ToolbarFieldUsage = ({ options, t, value, viewId, ...props }) => {
  const updatedValue = useSelector(({ view }) => view.query?.[viewId]?.[RHSM_API_QUERY_TYPES.USAGE], value);
  const updatedOptions = options.map(option => ({ ...option, selected: option.value === updatedValue }));

  /**
   * On select, dispatch type.
   *
   * @event onSelect
   * @param {object} event
   * @returns {void}
   */
  const onSelect = (event = {}) =>
    store.dispatch([
      {
        type: reduxTypes.query.SET_QUERY_CLEAR_INVENTORY_LIST
      },
      {
        type: reduxTypes.toolbar.SET_ACTIVE_FILTERS,
        viewId,
        // currentFilter: categoryOptions.find(obj => obj.value === RHSM_API_QUERY_TYPES.USAGE)?.title
        currentFilter: categoryOptions.find(obj => obj.value === RHSM_API_QUERY_TYPES.USAGE)?.value
      },
      {
        type: reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.USAGE],
        viewId,
        [RHSM_API_QUERY_TYPES.USAGE]: event.value
      }
    ]);

  return (
    <Select
      aria-label={t('curiosity-toolbar.placeholder', { context: 'usage' })}
      onSelect={onSelect}
      options={updatedOptions}
      selectedOptions={updatedValue}
      placeholder={t('curiosity-toolbar.placeholder', { context: 'usage' })}
      {...props}
    />
  );
};

/**
 * Prop types.
 *
 * @type {{viewId: string, t: Function, options: Array, value: string}}
 */
ToolbarFieldUsage.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.node,
      value: PropTypes.any,
      selected: PropTypes.bool
    })
  ),
  t: PropTypes.func,
  value: PropTypes.oneOf([...Object.values(FIELD_TYPES)]),
  viewId: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{viewId: string, t: translate, options: Array, value: string}}
 */
ToolbarFieldUsage.defaultProps = {
  options: toolbarFieldOptions,
  t: translate,
  value: null,
  viewId: 'toolbarFieldUsage'
};

export { ToolbarFieldUsage as default, ToolbarFieldUsage, toolbarFieldOptions };
