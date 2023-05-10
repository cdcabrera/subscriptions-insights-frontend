import React from 'react';
import PropTypes from 'prop-types';
import { translate } from '../components/i18n/i18n';

const GraphCard = ({ t }) => <span>{t('curiosity-modules.graphCard', 'Hello world')}</span>;

/**
 * Prop types.
 *
 * @type {{t: Function}}
 */
GraphCard.propTypes = {
  t: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{t: Function}}
 */
GraphCard.defaultProps = {
  t: translate
};

export { GraphCard as default, GraphCard };
