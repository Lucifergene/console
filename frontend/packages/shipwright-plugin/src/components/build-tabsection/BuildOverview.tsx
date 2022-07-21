import * as React from 'react';
import { Flex, FlexItem } from '@patternfly/react-core';
import * as _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  ResourceLink,
  resourcePath,
  SidebarSectionHeading,
} from '@console/internal/components/utils';
import { referenceForModel } from '@console/internal/module/k8s/k8s';
import { OverviewItem } from '@console/shared';
import { BuildModel } from '../../models';
import { Build, BuildRun } from '../../types';
import BuildRunItem from './BuildRunItem';
import StartBuildButton from './StartBuildButton';
import TriggerLastBuildButton from './TriggerLastBuildButton';

const MAX_VISIBLE = 3;

type BuildsOverviewProps = {
  item: OverviewItem & {
    builds?: Build[];
    buildRuns?: BuildRun[];
  };
};

const BuildsOverview: React.FC<BuildsOverviewProps> = ({ item: { builds, buildRuns } }) => {
  const { t } = useTranslation();

  if (!builds || !builds.length) {
    return null;
  }

  return (
    <>
      <SidebarSectionHeading text={t('shipwright-plugin~BuildRuns')} />
      {builds.map((build) => {
        const buildRunsforBuild = buildRuns.filter(
          (buildRun) => buildRun.spec.buildRef.name === build.metadata.name,
        );
        return (
          <ul className="list-group pf-u-mb-xl">
            <li className="list-group-item">
              <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                <FlexItem>
                  <ResourceLink
                    inline
                    kind={referenceForModel(BuildModel)}
                    name={build.metadata.name}
                    namespace={build.metadata.namespace}
                  />
                </FlexItem>
                <FlexItem>
                  {buildRunsforBuild.length > MAX_VISIBLE && (
                    <Link
                      className="sidebar__section-view-all"
                      to={`${resourcePath(
                        referenceForModel(BuildModel),
                        build.metadata.name,
                        build.metadata.namespace,
                      )}/buildruns`}
                    >
                      {t('shipwright-plugin~View all {{buildRunsLength}}', {
                        buildRunsLength: buildRunsforBuild.length,
                      })}
                    </Link>
                  )}
                </FlexItem>

                <FlexItem>
                  {buildRunsforBuild.length === 0 ? (
                    <StartBuildButton build={build} namespace={build.metadata.namespace} />
                  ) : (
                    <TriggerLastBuildButton
                      buildRuns={buildRunsforBuild}
                      namespace={build.metadata.namespace}
                    />
                  )}
                </FlexItem>
              </Flex>
            </li>
            {buildRunsforBuild.length > 0 &&
              _.take(buildRunsforBuild, MAX_VISIBLE).map((br) => (
                <BuildRunItem key={br.metadata.uid} buildRun={br} />
              ))}
          </ul>
        );
      })}
    </>
  );
};

export default BuildsOverview;
