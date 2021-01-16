import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox as PfCheckbox } from '@patternfly/react-core/dist/js/components/Checkbox';
import { helpers } from '../../common';

/**
 * Render a checkbox form element. Provides restructured event data.
 *
 * @fires onCheckboxChange
 * @param {object} props
 * @param {string} props.ariaLabel
 * @param {*} props.checked
 * @param {Node} props.children
 * @param {boolean} props.disabled
 * @param {Node} props.label
 * @param {string} props.name
 * @param {Function} props.onChange
 * @param {boolean} props.readOnly
 * @param {*} props.value
 * @returns {Node}
 */
const Checkbox = ({ ariaLabel, checked, children, disabled, label, name, onChange, readOnly, value, ...props }) => {
  const nameId = name || helpers.generateId();

  /**
   * onChange event, provide restructured event.
   *
   * @event onCheckboxChange
   * @param {boolean} isChecked
   * @param {object} event
   */
  const onCheckboxChange = (isChecked, event) => {
    const { currentTarget, target } = event;
    const mockEvent = {
      id: nameId,
      name: nameId,
      value,
      checked: isChecked,
      target,
      currentTarget,
      persist: helpers.noop
    };
    onChange(mockEvent);
  };

  return (
    <PfCheckbox
      aria-label={ariaLabel || children || label}
      checked={checked}
      id={nameId}
      isChecked={checked}
      isDisabled={disabled || false}
      label={children || label}
      name={nameId}
      onChange={onCheckboxChange}
      value={value}
      readOnly={readOnly || false}
      {...props}
    />
  );
};

/**
 * Prop types.
 *
 * @type {{onChange: Function, children: Node, name: string, checked: *, disabled: boolean,
 *     readOnly: boolean, label: string, value: *, ariaLabel: string}}
 */
Checkbox.propTypes = {
  ariaLabel: PropTypes.string,
  checked: PropTypes.any,
  children: PropTypes.node,
  disabled: PropTypes.bool,
  label: PropTypes.node,
  name: PropTypes.string,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
  value: PropTypes.any
};

/**
 * Default props.
 *
 * @type {{onChange: Function, children: Node, name: string, checked: *, disabled: boolean,
 *     readOnly: boolean, label: string, value: *, ariaLabel: string}}
 */
Checkbox.defaultProps = {
  ariaLabel: null,
  checked: undefined,
  children: null,
  disabled: false,
  label: '',
  name: null,
  onChange: helpers.noop,
  readOnly: false,
  value: undefined
};

export { Checkbox as default, Checkbox };
