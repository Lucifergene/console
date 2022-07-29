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
import { BUILDRUN_TO_RESOURCE_MAP_LABEL } from '../../const';
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

const BuildsOverview: React.FC<BuildsOverviewProps> = ({ item: { builds, buildRuns, obj } }) => {
  const { t } = useTranslation();
  const buildRunsforResource = _.filter(buildRuns, (buildRun) => {
    return (
      buildRun.metadata?.labels?.[BUILDRUN_TO_RESOURCE_MAP_LABEL] ===
      obj.metadata?.labels?.[BUILDRUN_TO_RESOURCE_MAP_LABEL]
    );
  });

  if (!builds || !builds.length) {
    return null;
  }

  return (
    <>
      <SidebarSectionHeading text={t('shipwright-plugin~BuildRuns')}>
        {buildRunsforResource.length > MAX_VISIBLE && (
          <Link
            className="sidebar__section-view-all"
            to={`/k8s/ns/${obj.metadata?.namespace}/shipwright.io~v1alpha1~BuildRun?labels=${BUILDRUN_TO_RESOURCE_MAP_LABEL}=${obj.metadata?.labels?.[BUILDRUN_TO_RESOURCE_MAP_LABEL]}`}
          >
            {t('shipwright-plugin~View all {{buildRunsLength}}', {
              buildRunsLength: buildRunsforResource.length,
            })}
          </Link>
        )}
      </SidebarSectionHeading>
      {builds.map((build) => {
        const buildRunsforBuild = buildRuns.filter(
          (buildRun) =>
            buildRun.spec.buildRef.name === build.metadata.name &&
            buildRun.metadata?.labels?.[BUILDRUN_TO_RESOURCE_MAP_LABEL] ===
              obj.metadata?.labels?.[BUILDRUN_TO_RESOURCE_MAP_LABEL],
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
                      )}/buildruns?labels=${BUILDRUN_TO_RESOURCE_MAP_LABEL}=${
                        obj.metadata?.labels?.[BUILDRUN_TO_RESOURCE_MAP_LABEL]
                      }`}
                    >
                      {t('shipwright-plugin~View all {{buildRunsLength}}', {
                        buildRunsLength: buildRunsforBuild.length,
                      })}
                    </Link>
                  )}
                </FlexItem>

                <FlexItem>
                  {buildRunsforBuild.length === 0 ? (
                    <StartBuildButton
                      build={build}
                      resource={obj}
                      namespace={build.metadata.namespace}
                    />
                  ) : (
                    <TriggerLastBuildButton
                      buildRuns={buildRunsforBuild}
                      resource={obj}
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
