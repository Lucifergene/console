import { getBuildRunStatusProps } from './components/buildrun-status/BuildRunStatus';
import { BuildRun, ComputedBuildRunStatus as runStatus } from './types';

export type LatestBuildRunStatus = {
  latestBuildRun: BuildRun;
  status: string;
};

export interface Runs {
  data?: BuildRun[];
}

export const getLatestRun = (runs: Runs, field: string): BuildRun => {
  if (!runs || !runs.data || !(runs.data.length > 0) || !field) {
    return null;
  }
  let latestRun = runs.data[0];
  if (field === 'creationTimestamp') {
    for (let i = 1; i < runs.data.length; i++) {
      latestRun =
        runs.data[i] &&
        runs.data[i].metadata &&
        runs.data[i].metadata[field] &&
        new Date(runs.data[i].metadata[field]) > new Date(latestRun.metadata[field])
          ? runs.data[i]
          : latestRun;
    }
  } else if (field === 'startTime' || field === 'completionTime') {
    for (let i = 1; i < runs.data.length; i++) {
      latestRun =
        runs.data[i] &&
        runs.data[i].status &&
        runs.data[i].status[field] &&
        new Date(runs.data[i].status[field]) > new Date(latestRun.status[field])
          ? runs.data[i]
          : latestRun;
    }
  } else {
    latestRun = runs.data[runs.data.length - 1];
  }
  return latestRun;
};

export const getLatestBuildRunStatus = (buildRuns: BuildRun[]): LatestBuildRunStatus => {
  if (!buildRuns || buildRuns.length === 0) {
    return { latestBuildRun: null, status: runStatus.UNKNOWN };
  }

  const latestBuildRun = getLatestRun({ data: buildRuns }, 'creationTimestamp');

  if (!latestBuildRun) {
    return { latestBuildRun: null, status: runStatus.UNKNOWN };
  }

  const { status } = getBuildRunStatusProps(latestBuildRun);

  return {
    latestBuildRun,
    status,
  };
};
