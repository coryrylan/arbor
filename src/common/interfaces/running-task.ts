import { Project, TaskCommand } from './project';

export enum TaskStatus {
  Waiting,
  InProgress,
  Success,
  Failed,
  DependendecyFailed
}

export interface RunningTask {
  project: Project;
  taskName: string;
  status: TaskStatus;
  currentCommand?: TaskCommand;
  progressLogLine?: string;
  statusText?: string;
}
