import React from 'react';
import PropTypes from 'prop-types';
import { connect, reduxTypes, store } from '../../redux';
import { Select } from '../form/select';
import { RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES, RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';
import { translate } from '../i18n/i18n';

/**
 * Display a granularity field with options.
 *
 * @fires onSelect
 * @param {object} props
 * @param {string} props.value
 * @param {Function} props.t
 * @param {string} props.viewId
 * @returns {Node}
 */
const ToolbarFieldGranularity = ({ value, t, viewId }) => {
  const options = Object.values(GRANULARITY_TYPES).map(type => ({
    title: translate('curiosity-toolbar.granularity', { context: type }),
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
    store.dispatch({
      type: reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.GRANULARITY],
      viewId,
      [RHSM_API_QUERY_TYPES.GRANULARITY]: event.value
    });

  return (
    <Select
      aria-label={t('curiosity-toolbar.placeholder', { context: 'granularity' })}
      onSelect={onSelect}
      options={options}
      selectedOptions={value}
      placeholder={t('curiosity-toolbar.placeholder', { context: 'granularity' })}
    />
  );
};

/**
 * Prop types.
 *
 * @type {{viewId: string, t: Function, value: string}}
 */
ToolbarFieldGranularity.propTypes = {
  t: PropTypes.func,
  value: PropTypes.oneOf([...Object.values(GRANULARITY_TYPES)]),
  viewId: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{viewId: string, t: translate, value: string}}
 */
ToolbarFieldGranularity.defaultProps = {
  t: translate,
  value: GRANULARITY_TYPES.DAILY,
  viewId: 'toolbarFieldGranularity'
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
  value: view.graphTallyQuery?.[RHSM_API_QUERY_TYPES.GRANULARITY]?.[viewId]
});

const ConnectedToolbarFieldGranularity = connect(mapStateToProps)(ToolbarFieldGranularity);

export { ConnectedToolbarFieldGranularity as default, ConnectedToolbarFieldGranularity, ToolbarFieldGranularity };
