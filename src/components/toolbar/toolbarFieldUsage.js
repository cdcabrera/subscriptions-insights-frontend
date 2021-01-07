import React from 'react';
import PropTypes from 'prop-types';
import { connect, reduxTypes, store } from '../../redux';
import { Select } from '../form/select';
import { RHSM_API_QUERY_USAGE_TYPES as FIELD_TYPES, RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';
import { translate } from '../i18n/i18n';

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
 * @param {string} props.value
 * @param {Function} props.t
 * @param {string} props.viewId
 * @returns {Node}
 */
const ToolbarFieldUsage = ({ value, t, viewId }) => {
  const options = toolbarFieldOptions.map(option => ({ ...option, selected: option.value === value }));
  /*
  const options = Object.values(FIELD_TYPES).map(type => ({
    title: translate('curiosity-toolbar.usage', { context: (type === '' && 'Unspecified') || type }),
    value: type,
    selected: type === value
  }));
   */

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
        type: reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.USAGE],
        viewId,
        [RHSM_API_QUERY_TYPES.USAGE]: event.value
      }
    ]);

  return (
    <Select
      aria-label={t('curiosity-toolbar.placeholder', { context: 'usage' })}
      onSelect={onSelect}
      options={options}
      selectedOptions={value}
      placeholder={t('curiosity-toolbar.placeholder', { context: 'usage' })}
    />
  );
};

/**
 * Prop types.
 *
 * @type {{viewId: string, t: Function, value: string}}
 */
ToolbarFieldUsage.propTypes = {
  t: PropTypes.func,
  value: PropTypes.oneOf([...Object.values(FIELD_TYPES)]),
  viewId: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{viewId: string, t: translate, value: string}}
 */
ToolbarFieldUsage.defaultProps = {
  t: translate,
  value: null,
  viewId: 'toolbarFieldUsage'
};

/**
 * Apply state to props.
 *
 * @param {object} state
 * @param {object} state.view
 * @param {object} props
 * @param {string} props.viewId
 * @returns {object}
 */
const mapStateToProps = ({ view }, { viewId }) => ({
  value: view.query?.[RHSM_API_QUERY_TYPES.USAGE]?.[viewId]
});

const ConnectedToolbarFieldUsage = connect(mapStateToProps)(ToolbarFieldUsage);

export { ConnectedToolbarFieldUsage as default, ConnectedToolbarFieldUsage, ToolbarFieldUsage, toolbarFieldOptions };
