import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// import
import { Alert, AlertActionCloseButton, AlertVariant, Button } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { useShallowCompareEffect } from 'react-use';
import { apiQueries, connect, reduxActions, reduxSelectors } from '../../redux';
import { translate } from '../i18n/i18n';
import { dateHelpers, helpers } from '../../common';
import { RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES, RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';
import { useRouteDetail } from '../../hooks/useRouter';
import InventoryTabs from "../inventoryTabs/inventoryTabs";
// import useAppMessages from "../../redux/selectors/appMessagesSelectors";
// import  from "../productView/productContext";
// import { context as productQueries } from '../productView/productContext';
// import productConfig from "../../config/routes";

/**
 * Render banner messages.
 *
 * @param {object} props
 * @param {Function} props.getMessageReports
 * @param {object} props.appMessages
 * @param {Array} props.messages
 * @returns {Node}
 */
// const BannerMessages = ({ getMessageReports, appMessages, messages }) => {
const BannerMessages = ({ getMessageReports, messages }) => {
  const [hideAlerts, setHideAlerts] = useState({});
  const [alerts, setAlerts] = useState([]);
  // const { pathParameter: productId, productParameter: productLabel, productConfig, viewId } = useRouteDetail();
  const { pathParameter: productId, productConfig } = useRouteDetail();
  const query = (productConfig.length === 1 && apiQueries.parseRhsmQuery(productConfig[0]?.query)?.query) || null;
  // const appMessages = {};
  const { appMessages } = reduxSelectors.appMessages.useAppMessages();
  // console.log('>>>>>>>>>', testing);

  // const query = useProductQuery();
  // const graphTallyQuery = productQueries.useGraphTallyQuery();
  // if there is a single product in the display we perform this check...

  // console.log('BANNER >>>>>>', getMessageReports, graphTallyQuery, productId);
  // console.log('>>>>>>>>>>', results);

  useShallowCompareEffect(() => {
    if (productId && query) {
      const { startDate, endDate } = dateHelpers.getRangedDateTime('CURRENT');
      const updatedGraphQuery = {
        ...query,
        [RHSM_API_QUERY_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY,
        [RHSM_API_QUERY_TYPES.START_DATE]: startDate.toISOString(),
        [RHSM_API_QUERY_TYPES.END_DATE]: endDate.toISOString()
      };

      getMessageReports(productId, updatedGraphQuery);
    }
  }, [getMessageReports, productId, query]);

  useShallowCompareEffect(() => {
    const updatedMessages = [];

    if (messages.length) {
      Object.entries(appMessages).forEach(([key, value]) => {
        if (hideAlerts[key] !== true && value === true) {
          const message = messages.find(({ id }) => id === key);

          if (message) {
            updatedMessages.push({
              key,
              ...message
            });
          }
        }
      });
    }

    console.log('messages >>>>>>>>>>>>>>', updatedMessages);

    setAlerts(
      updatedMessages.map(({ key, message, title, variant = AlertVariant.info }) => {
        const actionClose = <AlertActionCloseButton onClose={() => setHideAlerts({ ...hideAlerts, [key]: true })} />;

        return (
          <Alert actionClose={actionClose} key={key} title={title} variant={variant}>
            {message}
          </Alert>
        );
      })
    );
  }, [appMessages, hideAlerts, messages]);

  // const alerts = this.renderAlerts();

  if (alerts?.length) {
    return <div className="curiosity-banner-messages">{alerts}</div>;
  }

  return null;
};

/**
 * Prop types.
 *
 * @type {{appMessages: object, productId: string, getMessageReports: Function, query: object, messages: Array}}
 */
BannerMessages.propTypes = {
  // appMessages: PropTypes.object.isRequired,
  getMessageReports: PropTypes.func,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.node.isRequired,
      message: PropTypes.node.isRequired,
      variant: PropTypes.oneOf([...Object.values(AlertVariant)])
    })
  )
};

/**
 * Default props.
 *
 * @type {{getMessageReports: Function, query: object, messages: Array}}
 */
BannerMessages.defaultProps = {
  getMessageReports: helpers.noop,
  messages: [
    {
      id: 'cloudigradeMismatch',
      title: translate('curiosity-banner.dataMismatchTitle'),
      message: translate(
        'curiosity-banner.dataMismatchMessage',
        {
          context: helpers.UI_LINK_REPORT_ACCURACY_RECOMMENDATIONS !== '' && 'cloudigradeMismatch',
          appName: helpers.UI_DISPLAY_NAME
        },
        [
          <Button
            isInline
            component="a"
            variant="link"
            icon={<ExternalLinkAltIcon />}
            iconPosition="right"
            target="_blank"
            href={helpers.UI_LINK_REPORT_ACCURACY_RECOMMENDATIONS}
          />
        ]
      )
    }
  ]
};

/**
 * Apply actions to props.
 *
 * @param {Function} dispatch
 * @returns {object}
 */
const mapDispatchToProps = dispatch => ({
  getMessageReports: (id, query) => dispatch(reduxActions.rhsm.getMessageReports(id, query))
});

/**
 * Create a selector from applied state, props.
 *
 * @type {Function}
 */
// const makeMapStateToProps = reduxSelectors.appMessages.makeAppMessages();

// const ConnectedBannerMessages = connect(makeMapStateToProps, mapDispatchToProps)(BannerMessages);

// export { ConnectedBannerMessages as default, ConnectedBannerMessages, BannerMessages };
// export { BannerMessages as default, BannerMessages };
// export { ConnectedBannerMessages as default, ConnectedBannerMessages, BannerMessages };

/**
 * Create a selector from applied state, props.
 *
 * @type {Function}
 */
const mapStateToProps = () => ({});

const ConnectedBannerMessages = connect(mapStateToProps, mapDispatchToProps)(BannerMessages);

export { ConnectedBannerMessages as default, ConnectedBannerMessages, BannerMessages };
