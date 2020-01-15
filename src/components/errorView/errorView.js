import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import { EmptyState, EmptyStateBody, EmptyStateIcon, EmptyStateVariant } from '@patternfly/react-core';
import { BanIcon } from '@patternfly/react-icons';
import { helpers } from '../../common';

const ErrorView = ({ copy, t, title, icon }) => (
  <React.Fragment>
    <PageHeader>
      <PageHeaderTitle title={title || t('curiosity-error.errorTitle')} />
    </PageHeader>
    <EmptyState variant={EmptyStateVariant.full} className="fadein">
      <EmptyStateIcon icon={icon} />
      <EmptyStateBody>{copy || t('curiosity-error.errorCopy')}</EmptyStateBody>
    </EmptyState>
  </React.Fragment>
);

ErrorView.propTypes = {
  copy: PropTypes.string,
  icon: PropTypes.element,
  t: PropTypes.func,
  title: PropTypes.string
};

ErrorView.defaultProps = {
  copy: null,
  icon: BanIcon,
  t: helpers.noopTranslate,
  title: null
};

const TranslatedErrorView = withTranslation()(ErrorView);

export { TranslatedErrorView as default, TranslatedErrorView, ErrorView };
