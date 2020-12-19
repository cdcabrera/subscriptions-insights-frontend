import React from 'react';
import PropTypes from 'prop-types';
import { TextInput as PfTextInput } from '@patternfly/react-core';
import { helpers } from '../../common';

class TextInput extends React.Component {
  state = {
    value: ''
  };

  onChange = (value, event) => {
    const { onChange } = this.props;
    const { currentTarget, target } = event;

    this.setState({ value }, () => {
      onChange({
        id: currentTarget.name,
        name: currentTarget.name,
        value,
        target,
        currentTarget,
        persist: helpers.noop
      });
    });
  };

  render() {
    const { name, value } = this.state;
    const { className, type, ...props } = this.props;
    const nameId = name || helpers.generateId();

    return (
      <PfTextInput
        id={nameId}
        name={nameId}
        className={`curiosity-text-input ${className}`}
        value={value}
        type={type}
        onChange={this.onChange}
        {...props}
      />
    );
  }
}

/**
 * Prop types.
 */
TextInput.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.string
};

/**
 * Default props.
 */
TextInput.defaultProps = {
  className: '',
  name: null,
  onChange: helpers.noop,
  type: 'text'
};

export { TextInput as default, TextInput };
