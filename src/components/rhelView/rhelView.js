import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import {
  chart_color_blue_100 as chartColorBlueLight,
  chart_color_blue_300 as chartColorBlueDark,
  chart_color_cyan_100 as chartColorCyanLight,
  chart_color_cyan_300 as chartColorCyanDark
} from '@patternfly/react-tokens';
import { PageLayout, PageHeader, PageSection } from '../pageLayout/pageLayout';
import GraphCard from '../graphCard/graphCard';
import { helpers } from '../../common';

class RhelView extends React.Component {
  componentDidMount() {}

  render() {
    const { initialFilters, routeDetail, t } = this.props;

    return (
      <PageLayout>
        <PageHeader>
          {(routeDetail.routeItem && routeDetail.routeItem.title) || helpers.UI_DISPLAY_CONFIG_NAME}
        </PageHeader>
        <PageSection>
          <GraphCard
            key={routeDetail.pathParameter}
            filterGraphData={initialFilters}
            productId={routeDetail.pathParameter}
            viewId={routeDetail.pathId}
            cardTitle={t('curiosity-graph.cardHeading')}
            productShortLabel="RHEL"
          />
        </PageSection>
      </PageLayout>
    );
  }
}

RhelView.propTypes = {
  initialFilters: PropTypes.array,
  routeDetail: PropTypes.shape({
    pathParameter: PropTypes.string.isRequired,
    pathId: PropTypes.string.isRequired,
    routeItem: PropTypes.shape({
      title: PropTypes.string
    })
  }).isRequired,
  t: PropTypes.func
};

RhelView.defaultProps = {
  initialFilters: [
    { id: 'physicalSockets', fill: chartColorBlueLight.value, stroke: chartColorBlueDark.value },
    { id: 'hypervisorSockets', fill: chartColorCyanLight.value, stroke: chartColorCyanDark.value },
    { id: 'thresholdSockets' }
  ],
  t: helpers.noopTranslate
};

const TranslatedRhelView = withTranslation()(RhelView);

export { TranslatedRhelView as default, TranslatedRhelView, RhelView };
