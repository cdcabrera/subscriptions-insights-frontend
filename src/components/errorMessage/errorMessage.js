import React, { useState } from 'react';
import {
  Button,
  ClipboardCopy,
  ClipboardCopyButton,
  ClipboardCopyVariant,
  clipboardCopyFunc,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Title
} from '@patternfly/react-core';
import { CopyIcon, CogIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import { helpers } from '../../common';
import { translate } from '../i18n/i18n';

/**
 * Error message component wrapper.
 *
 * @memberof Components
 * @module ErrorMessage
 */

/**
 * Display 4xx and 5xx related error messages.
 *
 * @param {object} props
 * @param {string|Error} [props.message]
 * @param {string} [props.description]
 * @param {string} [props.title]
 * @param {translate} [props.t=translate]
 * @returns {JSX.Element}
 */
const ErrorMessage = ({ message, description, title, t = translate }) => {
  const [isErrorDisplay, setIsErrorDisplay] = useState(false);
  const errorStr = (typeof message === 'string' && message) || message?.message;
  const cause = message?.cause && (
    <textarea readOnly rows="10" style={{ width: '100%', resize: 'vertical', whiteSpace: 'pre-wrap' }}>
      {JSON.stringify([message.cause], null, 2)}
    </textarea>
  );

  return (
    <div>
      {(cause || errorStr) && (
        <Button
          title={t('curiosity-view.error', { context: 'debug' })}
          style={{ float: 'right' }}
          variant="link"
          onClick={() => setIsErrorDisplay(!isErrorDisplay)}
        >
          <CogIcon />
          <span className="sr-only">{t('curiosity-view.error', { context: 'debug' })}</span>
        </Button>
      )}
      {(isErrorDisplay && (cause || errorStr)) || (
        <EmptyState variant={EmptyStateVariant.full} className="fadein">
          <EmptyStateIcon icon={ExclamationCircleIcon} />
          <Title headingLevel="h2" size="lg">
            {title || t('curiosity-view.error', { context: 'title', appName: helpers.UI_INTERNAL_NAME })}
          </Title>
          <EmptyStateBody>
            {description ||
              t('curiosity-view.error', { context: 'description' }, [
                <Button isInline component="a" variant="link" target="_blank" href={helpers.UI_LINK_PLATFORM_STATUS} />
              ])}
          </EmptyStateBody>
        </EmptyState>
      )}
    </div>
  );
};

export { ErrorMessage as default, ErrorMessage };
