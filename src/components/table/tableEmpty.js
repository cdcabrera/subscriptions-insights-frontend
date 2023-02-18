import React from 'react';
import PropTypes from 'prop-types';
import { EmptyState, EmptyStateIcon, EmptyStateBody, EmptyStateVariant, Title } from '@patternfly/react-core';
import { EmptyTable as PlatformEmptyTableWrapper } from '@redhat-cloud-services/frontend-components/EmptyTable';

/**
 * @memberof Table
 * @module TableEmpty
 */

/**
 * Render an empty table.
 *
 * @param {object} props
 * @param {React.ReactNode|Function} props.icon
 * @param {React.ReactNode} props.message
 * @param {string} props.tableHeading
 * @param {React.ReactNode} props.title
 * @param {string} props.variant
 * @returns {React.ReactNode}
 */
const TableEmpty = ({ icon, message, tableHeading, title, variant }) => (
  <PlatformEmptyTableWrapper>
    <EmptyState variant={variant}>
      {icon && <EmptyStateIcon icon={icon} />}
      <Title headingLevel={tableHeading} size="lg">
        {title}
      </Title>
      <EmptyStateBody>{message}</EmptyStateBody>
    </EmptyState>
  </PlatformEmptyTableWrapper>
);

/**
 * Prop types.
 *
 * @type {{icon: React.ReactNode|Function, variant: string, message: React.ReactNode, title: React.ReactNode,
 *     tableHeading: string}}
 */
TableEmpty.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  message: PropTypes.node.isRequired,
  tableHeading: PropTypes.string,
  title: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(Object.keys(EmptyStateVariant))
};

/**
 * Default props.
 *
 * @type {{icon: null, variant: EmptyStateVariant.small, tableHeading: string}}
 */
TableEmpty.defaultProps = {
  icon: null,
  tableHeading: 'h2',
  variant: EmptyStateVariant.small
};

export { TableEmpty as default, TableEmpty };
