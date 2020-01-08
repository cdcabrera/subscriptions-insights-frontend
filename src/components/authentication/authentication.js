import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import { EmptyState, EmptyStateBody, EmptyStateIcon, EmptyStateVariant } from '@patternfly/react-core';
import { BanIcon, BinocularsIcon } from '@patternfly/react-icons';
import { Redirect } from 'react-router-dom';
import { connectRouter, reduxActions } from '../../redux';
import { helpers } from '../../common/helpers';
import { navigation as appNavigation, routes as appRoutes } from '../router/router';
import PageLayout from '../pageLayout/pageLayout';

class Authentication extends Component {
  appNav = helpers.noop;

  buildNav = helpers.noop;

  componentDidMount() {
    const { appName, authorizeUser, history, insights, session } = this.props;

    try {
      if (helpers.PROD_MODE || helpers.REVIEW_MODE) {
        insights.chrome.init();
        insights.chrome.identifyApp(appName);
        insights.chrome.navigation(this.buildNavigation());

        this.appNav = insights.chrome.on('APP_NAVIGATION', event => history.push(`${event.navId}`));
        this.buildNav = history.listen(() => insights.chrome.navigation(this.buildNavigation()));
      }

      if (!session.authorized) {
        authorizeUser();
      }
    } catch (e) {
      if (!helpers.TEST_MODE) {
        console.warn(`{ init, identifyApp, navigation } = insights.chrome: ${e.message}`);
      }
    }
  }

  componentWillUnmount() {
    this.appNav();
    this.buildNav();
  }

  buildNavigation = () => {
    const { navigation } = this.props;
    const currentPath = window.location.pathname.split('/').slice(-1)[0];

    return navigation.map(item => ({
      ...item,
      active: item.id === currentPath
    }));
  };

  renderErrorIssue() {
    const { session } = this.props;

    return (
      <PageLayout>
        <PageHeader>
          <PageHeaderTitle title={`Status ${session.errorStatus} `} />
        </PageHeader>
        <EmptyState variant={EmptyStateVariant.full} className="fadein">
          <EmptyStateIcon icon={BanIcon} />
          <EmptyStateBody>There appears to be an issue. Contact your administrator.</EmptyStateBody>
        </EmptyState>
      </PageLayout>
    );
  }

  render() {
    const { children, routes, session } = this.props;

    if (session.authorized) {
      return <React.Fragment>{children}</React.Fragment>;
    }

    if (session.pending) {
      return (
        <PageLayout>
          <PageHeader>
            <PageHeaderTitle title="&nbsp;" />
          </PageHeader>
          <EmptyState variant={EmptyStateVariant.full} className="fadein">
            <EmptyStateIcon icon={BinocularsIcon} />
            <EmptyStateBody>Authenticating...</EmptyStateBody>
          </EmptyState>
        </PageLayout>
      );
    }

    if (session.errorStatus === 418) {
      if (helpers.PROD_MODE || helpers.REVIEW_MODE) {
        window.location.replace(`${helpers.UI_DEPLOY_PATH_PREFIX}/?not_entitled=subscriptions`);
      }
      return this.renderErrorIssue();
    }

    const activateOnErrorRoute = routes.find(route => route.activateOnError === true);

    if (activateOnErrorRoute && session.errorStatus >= 400 && session.errorStatus <= 499) {
      return (
        <React.Fragment>
          <Redirect to={activateOnErrorRoute.to} />
          {children}
        </React.Fragment>
      );
    }

    return this.renderErrorIssue();
  }
}

Authentication.propTypes = {
  appName: PropTypes.string,
  authorizeUser: PropTypes.func,
  children: PropTypes.node.isRequired,
  history: PropTypes.shape({
    listen: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired
  }).isRequired,
  insights: PropTypes.shape({
    chrome: PropTypes.shape({
      init: PropTypes.func,
      identifyApp: PropTypes.func,
      navigation: PropTypes.func,
      on: PropTypes.func
    })
  }),
  navigation: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string
    })
  ),
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      activateOnError: PropTypes.bool,
      to: PropTypes.string
    })
  ),
  session: PropTypes.shape({
    authorized: PropTypes.bool,
    error: PropTypes.bool,
    errorMessage: PropTypes.string,
    errorStatus: PropTypes.number,
    pending: PropTypes.bool
  })
};

Authentication.defaultProps = {
  appName: helpers.UI_NAME,
  authorizeUser: helpers.noop,
  insights: window.insights,
  navigation: appNavigation,
  routes: appRoutes,
  session: {
    authorized: false,
    error: false,
    errorMessage: '',
    errorStatus: null,
    pending: false
  }
};

const mapDispatchToProps = dispatch => ({
  authorizeUser: () => dispatch(reduxActions.user.authorizeUser())
});

const mapStateToProps = state => ({ session: state.user.session });

const ConnectedAuthentication = connectRouter(mapStateToProps, mapDispatchToProps)(Authentication);

export { ConnectedAuthentication as default, ConnectedAuthentication, Authentication };
