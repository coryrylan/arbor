import { ConfigService } from './services/config.service';
import { ConsoleService } from './services/console.service';
import { LogService } from './services/log.service';
import { ProjectService } from './services/project.service';
import { ShellService } from './services/shell.service';
import { TaskRunnerService } from './services/task-runner.service';
import { VersionService } from './services/version.service';

export const providers = [
  ConfigService,
  ConsoleService,
  LogService,
  ProjectService,
  ShellService,
  TaskRunnerService,
  VersionService
];
