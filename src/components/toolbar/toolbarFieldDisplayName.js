import React from 'react';
import PropTypes from 'prop-types';
import { connect, reduxTypes, store } from '../../redux';
import { TextInput } from '../form/textInput';
import { RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';
import { translate } from '../i18n/i18n';

/**
 * Display a display name input field for search.
 *
 * @fires onChange
 * @param {object} props
 * @param {string} props.value
 * @param {Function} props.t
 * @param {string} props.viewId
 * @returns {Node}
 */
const ToolbarFieldDisplayName = ({ value, t, viewId }) => {
  /**
   * On change, dispatch type.
   *
   * @event onChange
   * @param {object} event
   * @returns {void}
   */
  const onChange = (event = {}) =>
    store.dispatch([
      {
        type: reduxTypes.query.SET_QUERY_CLEAR_INVENTORY_LIST
      },
      {
        type: reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.DISPLAY_NAME],
        viewId,
        [RHSM_API_QUERY_TYPES.DISPLAY_NAME]: event.value
      }
    ]);

  return (
    <TextInput
      aria-label={t('curiosity-toolbar.placeholder', { context: 'displayName' })}
      onChange={onChange}
      value={value}
      placeholder={t('curiosity-toolbar.placeholder', { context: 'displayName' })}
    />
  );
};

/**
 * Prop types.
 *
 * @type {{viewId: string, t: Function, value: string}}
 */
ToolbarFieldDisplayName.propTypes = {
  t: PropTypes.func,
  value: PropTypes.string,
  viewId: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{viewId: string, t: translate, value: string}}
 */
ToolbarFieldDisplayName.defaultProps = {
  t: translate,
  value: null,
  viewId: 'toolbarFieldDisplayName'
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
  value: view.inventoryHostsQuery?.[RHSM_API_QUERY_TYPES.DISPLAY_NAME]?.[viewId]
});

const ConnectedToolbarFieldDisplayName = connect(mapStateToProps)(ToolbarFieldDisplayName);

export { ConnectedToolbarFieldDisplayName as default, ConnectedToolbarFieldDisplayName, ToolbarFieldDisplayName };
