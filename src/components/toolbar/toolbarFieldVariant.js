import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from '../../hooks/useRouter';
import { useProduct } from '../productView/productViewContext';
import { reduxTypes, storeHooks } from '../../redux';
import { RHSM_API_QUERY_SET_TYPES } from '../../services/rhsm/rhsmConstants';
import { Select, SelectPosition } from '../form/select';
import { translate } from '../i18n/i18n';

/**
 * Generate select field options from config
 *
 * @param {object} options
 * @param {Function} options.useProduct
 * @returns {Function}
 */
const useToolbarFieldOptions = ({ useProduct: useAliasProduct = useProduct } = {}) => {
  const { productVariants } = useAliasProduct();
  const options = [];

  if (Array.isArray(productVariants)) {
    options.push(
      ...productVariants.map(type => ({
        title: translate('curiosity-toolbar.variant', { context: (type === '' && 'unspecified') || type }),
        value: type,
        selected: false
      }))
    );
  }

  return options;
};

/**
 * On select update sla.
 *
 * @param {object} options
 * @param {Function} options.useDispatch
 * @param {Function} options.useHistory
 * @param {Function} options.useProduct
 * @returns {Function}
 */
const useOnSelect = ({
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useHistory: useAliasHistory = useHistory,
  useProduct: useAliasProduct = useProduct
} = {}) => {
  const { viewId } = useAliasProduct();
  const dispatch = useAliasDispatch();
  const history = useAliasHistory({ isSetAppNav: true });
  console.log('>>>', history);

  return ({ value = null } = {}) => {
    dispatch([
      {
        type: reduxTypes.query.SET_QUERY_RESET_INVENTORY_LIST,
        viewId
      },
      {
        type: reduxTypes.query.SET_QUERY,
        viewId,
        filter: RHSM_API_QUERY_SET_TYPES.VARIANT,
        value
      }
    ]);

    // history.push(value);
  };
};

/**
 * Display a variant field with generated options.
 *
 * @fires onSelect
 * @param {object} props
 * @param {boolean} props.isFilter
 * @param {string} props.position
 * @param {Function} props.t
 * @param {Function} props.useOnSelect
 * @param {Function} props.useProduct
 * @param {Function} props.useToolbarFieldOptions
 * @returns {Node}
 */
const ToolbarFieldVariant = ({
  isFilter,
  position,
  t,
  useOnSelect: useAliasOnSelect,
  useProduct: useAliasProduct,
  useToolbarFieldOptions: useAliasToolbarFieldOptions
}) => {
  const { productId: updatedValue } = useAliasProduct();
  const onSelect = useAliasOnSelect();
  const options = useAliasToolbarFieldOptions();
  const updatedOptions = options.map(option => ({ ...option, selected: option.value === updatedValue }));

  return (
    <Select
      aria-label={t('curiosity-toolbar.placeholder', { context: [isFilter && 'filter', 'variant'] })}
      onSelect={onSelect}
      options={updatedOptions}
      selectedOptions={updatedValue}
      placeholder={t('curiosity-toolbar.placeholder', { context: [isFilter && 'filter', 'variant'] })}
      position={position}
      data-test="toolbarFieldVariant"
    />
  );
};

/**
 * Prop types.
 *
 * @type {{useOnSelect: Function, useProduct: Function, t: Function, isFilter: boolean, position: string,
 *     useToolbarFieldOptions: Function}}
 */
ToolbarFieldVariant.propTypes = {
  isFilter: PropTypes.bool,
  position: PropTypes.string,
  t: PropTypes.func,
  useOnSelect: PropTypes.func,
  useProduct: PropTypes.func,
  useToolbarFieldOptions: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useOnSelect: Function, useProduct: Function, t: translate, isFilter: boolean, position: string,
 *     useToolbarFieldOptions: Function}}
 */
ToolbarFieldVariant.defaultProps = {
  isFilter: false,
  position: SelectPosition.left,
  t: translate,
  useOnSelect,
  useProduct,
  useToolbarFieldOptions
};

export { ToolbarFieldVariant as default, ToolbarFieldVariant, useOnSelect, useToolbarFieldOptions };
