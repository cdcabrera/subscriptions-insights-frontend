import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Tabs as PfTabs, Tab, TabTitleText, Grid, GridItem } from '@patternfly/react-core';
import { helpers } from '../../common';

/**
 * PF tabs with state.
 *
 * @memberof Components
 * @module Tabs
 */

/**
 * A set of tabs.
 *
 * @param {object} props
 * @param {number} props.defaultActiveTab
 * @param {Array} props.tabs
 * @param {Function} props.onTab
 * @param {string} props.className
 * @param {boolean} props.hasOverflowScroll
 * @param {number} props.activeTab
 * @fires onTab
 * @returns {React.ReactNode}
 */
const Tabs = ({ activeTab, defaultActiveTab, tabs, onTab, className, hasOverflowScroll }) => {
  // const configActiveTab = tabs
  //  .map(({ active }, index) => ({ active, index }))
  //  .find(({ active }) => active === true)?.index;

  // const [updatedActiveTab, setUpdatedActiveTab] = useState(activeTab ?? configActiveTab ?? defaultActiveTab);
  const [updatedActiveTab, setUpdatedActiveTab] = useState(activeTab ?? defaultActiveTab);

  const confirmActiveTab = () => {
    if (!tabs?.[updatedActiveTab]) {
      setUpdatedActiveTab(defaultActiveTab);
    }
  };

  confirmActiveTab();
  // console.log('>>>> active tab', activeTab);

  const updatedTabs = tabs.map(({ active, content, title }, index) => {
    if (typeof active === 'number') {
      setUpdatedActiveTab(active);
    }

    return (
      <Tab key={title} eventKey={index} title={<TabTitleText>{title}</TabTitleText>}>
        {content}
      </Tab>
    );
  });

  /*
  const updatedTabs = useMemo(
    () =>
      tabs.map(({ active, content, title }, index) => {
        if (typeof active === 'number') {
          // setUpdatedActiveTab(active);
        }
        return (
          <Tab key={title} eventKey={index} title={<TabTitleText>{title}</TabTitleText>}>
            {content}
          </Tab>
        );
      }),
    [tabs]
  );
  */

  const onSelect = ({ index }) => {
    setUpdatedActiveTab(index);
    onTab({ index });
  };

  return (
    <Grid className="curiosity-tabs-container">
      <GridItem span={12}>
        <PfTabs
          className={`curiosity-tabs${(!hasOverflowScroll && '__no-scroll') || ''} ${className || ''}`}
          activeKey={updatedActiveTab}
          onSelect={(event, index) => onSelect({ event, index })}
          mountOnEnter
          unmountOnExit
          id={helpers.generateId()}
          inset={{
            default: 'insetNone',
            md: 'insetLg'
          }}
        >
          {updatedTabs}
        </PfTabs>
      </GridItem>
    </Grid>
  );
};

/**
 * Prop types.
 *
 * @type {{tabs: Array, hasOverflowScroll: boolean, onTab: Function, className: string,
 *     defaultActiveTab: number, activeTab: number}}
 */
Tabs.propTypes = {
  activeTab: PropTypes.number,
  className: PropTypes.string,
  defaultActiveTab: PropTypes.number,
  hasOverflowScroll: PropTypes.bool,
  onTab: PropTypes.func,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      active: PropTypes.bool,
      content: PropTypes.node.isRequired,
      title: PropTypes.node.isRequired
    })
  )
};

/**
 * Default props.
 *
 * @type {{tabs: Array, hasOverflowScroll: boolean, onTab: Function, className: string,
 *     defaultActiveTab: number, activeTab: number}}
 */
Tabs.defaultProps = {
  activeTab: null,
  className: '',
  defaultActiveTab: 0,
  hasOverflowScroll: false,
  onTab: helpers.noop,
  tabs: []
};

export { Tabs as default, Tabs };
