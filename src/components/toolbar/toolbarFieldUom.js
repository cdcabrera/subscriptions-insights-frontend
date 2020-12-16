import React from 'react';
import PropTypes from 'prop-types';
import { connect, reduxTypes, store } from '../../redux';
import { Select } from '../form/select';
import { RHSM_API_QUERY_UOM_TYPES as FIELD_TYPES, RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';
import { translate } from '../i18n/i18n';

/**
 * Display a unit of measure (uom) field with options.
 *
 * @fires onSelect
 * @param {object} props
 * @param {string} props.value
 * @param {Function} props.t
 * @param {string} props.viewId
 * @returns {Node}
 */
const ToolbarFieldUom = ({ value, t, viewId }) => {
  const options = Object.values(FIELD_TYPES).map(type => ({
    title: translate('curiosity-toolbar.uom', { context: type }),
    value: type,
    selected: type === value
  }));

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
        type: reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.UOM],
        viewId,
        [RHSM_API_QUERY_TYPES.UOM]: event.value
      }
    ]);

  return (
    <Select
      aria-label={t('curiosity-toolbar.placeholder', { context: 'uom' })}
      onSelect={onSelect}
      options={options}
      selectedOptions={value}
      placeholder={t('curiosity-toolbar.placeholder', { context: 'uom' })}
    />
  );
};

/**
 * Prop types.
 *
 * @type {{viewId: string, t: Function, value: string}}
 */
ToolbarFieldUom.propTypes = {
  t: PropTypes.func,
  value: PropTypes.oneOf([...Object.values(FIELD_TYPES)]),
  viewId: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{viewId: string, t: translate, value: string}}
 */
ToolbarFieldUom.defaultProps = {
  t: translate,
  value: FIELD_TYPES.CORES,
  viewId: 'toolbarFieldUom'
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
  value: view.query?.[RHSM_API_QUERY_TYPES.UOM]?.[viewId]
});

const ConnectedToolbarFieldUom = connect(mapStateToProps)(ToolbarFieldUom);

export { ConnectedToolbarFieldUom as default, ConnectedToolbarFieldUom, ToolbarFieldUom };
