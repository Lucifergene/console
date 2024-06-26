import * as React from 'react';
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  EmptyStateHeader,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import { global_danger_color_200 as globalDanger200 } from '@patternfly/react-tokens/dist/js/global_danger_color_200';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { iGet, iGetIn } from '../../../../utils/immutable';
import { iGetCreateVMWizardTabs } from '../../selectors/immutable/common';
import { iGetCommonData } from '../../selectors/immutable/selectors';
import { VMWizardProps, VMWizardTab } from '../../types';

const ErrorResultsComponent: React.FC<ErrorResultsProps> = ({
  isCreateTemplate,
  mainError,
  className,
}) => {
  const { t } = useTranslation();
  const title = isCreateTemplate
    ? t('kubevirt-plugin~Error creating virtual machine template')
    : t('kubevirt-plugin~Error creating virtual machine');

  return (
    <EmptyState variant={EmptyStateVariant.full} className={className}>
      <EmptyStateHeader
        titleText={<>{iGet(mainError, 'title') || title}</>}
        icon={<EmptyStateIcon icon={ExclamationCircleIcon} color={globalDanger200.value} />}
        headingLevel="h5"
      />
      <EmptyStateBody>
        {iGet(mainError, 'message')}
        {iGet(mainError, 'detail') ? <div>${iGet(mainError, 'detail')}</div> : null}
      </EmptyStateBody>
    </EmptyState>
  );
};

type ErrorResultsProps = {
  wizardReduxID: string;
  isCreateTemplate: boolean;
  mainError: {
    title?: string;
    message: string;
    detail?: string;
  };
  className?: string;
};

const stateToProps = (state, { wizardReduxID }) => {
  const stepData = iGetCreateVMWizardTabs(state, wizardReduxID);
  return {
    isCreateTemplate: iGetCommonData(state, wizardReduxID, VMWizardProps.isCreateTemplate),
    mainError: iGetIn(stepData, [VMWizardTab.RESULT, 'value', 'mainError']),
  };
};

export const ErrorResults = connect(stateToProps)(ErrorResultsComponent);
