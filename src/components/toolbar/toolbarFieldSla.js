import React from 'react';
import PropTypes from 'prop-types';
import { connect, reduxTypes, store } from '../../redux';
import { Select } from '../form/select';
import { RHSM_API_QUERY_SLA_TYPES as FIELD_TYPES, RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';
import { translate } from '../i18n/i18n';

const toolbarFieldOptions = Object.values(FIELD_TYPES).map(type => ({
  title: translate('curiosity-toolbar.sla', { context: (type === '' && 'none') || type }),
  value: type,
  selected: false
}));

/**
 * Display a sla field with options.
 *
 * @fires onSelect
 * @param {object} props
 * @param {string} props.value
 * @param {Function} props.t
 * @param {string} props.viewId
 * @returns {Node}
 */
const ToolbarFieldSla = ({ value, t, viewId }) => {
  const options = toolbarFieldOptions.map(option => ({ ...option, selected: option.value === value }));
  /*
  const options = Object.values(FIELD_TYPES).map(type => ({
    title: translate('curiosity-toolbar.sla', { context: (type === '' && 'none') || type }),
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
        type: reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.SLA],
        viewId,
        [RHSM_API_QUERY_TYPES.SLA]: event.value
      }
    ]);

  return (
    <Select
      aria-label={t('curiosity-toolbar.placeholder', { context: 'sla' })}
      onSelect={onSelect}
      options={options}
      selectedOptions={value}
      placeholder={t('curiosity-toolbar.placeholder', { context: 'sla' })}
    />
  );
};

/**
 * Prop types.
 *
 * @type {{viewId: string, t: Function, value: string}}
 */
ToolbarFieldSla.propTypes = {
  t: PropTypes.func,
  value: PropTypes.oneOf([...Object.values(FIELD_TYPES)]),
  viewId: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{viewId: string, t: translate, value: string}}
 */
ToolbarFieldSla.defaultProps = {
  t: translate,
  value: null,
  viewId: 'toolbarFieldSla'
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
  value: view.query?.[RHSM_API_QUERY_TYPES.SLA]?.[viewId]
});

const ConnectedToolbarFieldSla = connect(mapStateToProps)(ToolbarFieldSla);

export { ConnectedToolbarFieldSla as default, ConnectedToolbarFieldSla, ToolbarFieldSla, toolbarFieldOptions };
