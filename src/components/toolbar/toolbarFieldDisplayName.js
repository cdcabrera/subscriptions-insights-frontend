import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonVariant, InputGroup } from '@patternfly/react-core';
import SearchIcon from '@patternfly/react-icons/dist/js/icons/search-icon';
import { reduxTypes, store, useSelector } from '../../redux';
import { TextInput } from '../form/textInput';
import { RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';
import { translate } from '../i18n/i18n';

/**
 * Display a display name input field for search.
 *
 * @fires onSubmit
 * @param {object} props
 * @param {string} props.value
 * @param {Function} props.t
 * @param {string} props.viewId
 * @returns {Node}
 */
const ToolbarFieldDisplayName = ({ value, t, viewId }) => {
  let updatedValue = useSelector(
    ({ view }) => view.inventoryHostsQuery?.[RHSM_API_QUERY_TYPES.DISPLAY_NAME]?.[viewId],
    value
  );

  // ToDo: need to reset this for paging... but really only "offset"
  /**
   * On submit, dispatch type.
   *
   * @event onSubmit
   * @returns {void}
   */
  const onSubmit = () =>
    store.dispatch([
      {
        type: reduxTypes.query.SET_QUERY_CLEAR_INVENTORY_LIST
      },
      {
        type: reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.DISPLAY_NAME],
        viewId,
        [RHSM_API_QUERY_TYPES.DISPLAY_NAME]: updatedValue
      }
    ]);

  const onChange = (event = {}) => {
    updatedValue = event.value;
  };

  return (
    <InputGroup>
      <TextInput
        aria-label={t('curiosity-toolbar.placeholder', { context: 'displayName' })}
        onChange={onChange}
        value={updatedValue}
        placeholder={t('curiosity-toolbar.placeholder', { context: 'displayName' })}
        type="search"
      />
      <Button
        onClick={onSubmit}
        variant={ButtonVariant.control}
        aria-label={t('curiosity-toolbar.button', { context: 'displayName' })}
      >
        <SearchIcon />
      </Button>
    </InputGroup>
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

export { ToolbarFieldDisplayName as default, ToolbarFieldDisplayName };
