import { Injectable } from '@angular/core';
import * as path from 'path';
import { Observable } from 'rxjs/Observable';

import { computeUpdatedBuildTaskProgress } from '../../common/helpers/progress.helpers';
import { deleteFolder } from './../../common/helpers/fs.helpers';
import { TaskProgress } from './../../common/interfaces/build';
import { BuildConfiguration } from './../../common/interfaces/build-configuration';
import { Project } from './../../common/interfaces/project';
import { RunningTask } from './../../common/interfaces/running-task';
import { TaskStatus } from './../../common/interfaces/running-task';
import { ShellService } from './../../common/services/shell.service';
import { AgentService } from './agent.service';
import { GitHubAppService } from './github-app.service';

const checkoutPath = './checkout/';

interface CloneProject extends Project {
  repo: string;
}

interface CloneTask extends RunningTask {
  project: CloneProject;
}

@Injectable()
export class GitService {
  constructor(private agentService: AgentService, private githubApp: GitHubAppService, private shell: ShellService) { }

  cloneRepos(buildId: number, branch: string, configuration: BuildConfiguration) {
    let checkoutProgress: TaskProgress[] = [];

    const updateTaskStatus = (task: RunningTask, status: TaskStatus) => {
      return Observable.of(undefined)
        .switchMap(() => {
          task.status = status;
          checkoutProgress = computeUpdatedBuildTaskProgress(checkoutProgress, [task]);
          return this.agentService.updateBuildProgress(buildId, checkoutProgress, 'checkout');
        });
    };

    return this.agentService.updateBuildProgress(buildId, checkoutProgress, 'checkout')
      .switchMap(() => {
        const cleanTask: RunningTask = {
          taskFlag: 'clean',
          status: TaskStatus.Waiting,
          project: { name: 'all', projectPath: path.resolve(checkoutPath) }
        };

        return this.clean(cleanTask, (status: TaskStatus) => updateTaskStatus(cleanTask, status));
      })
      .switchMap(() => this.githubApp.getAccessToken())
      .switchMap(accessToken => {
        const cloneProject: CloneProject = {
          repo: configuration.repo,
          name: configuration.repo,
          projectPath: path.resolve(path.join(checkoutPath, configuration.repo))
        };

        const cloneTask: CloneTask = {
          project: cloneProject,
          taskFlag: 'clone',
          status: TaskStatus.Waiting
        };

        return this.clone(cloneTask, branch, accessToken, (status: TaskStatus) => updateTaskStatus(cloneTask, status));
      });
  }

  private clean(task: RunningTask, updateThisTaskStatus: (status: TaskStatus) => Observable<void>) {
    return updateThisTaskStatus(TaskStatus.InProgress)
      .switchMap(() => deleteFolder(task.project.projectPath))
      .switchMap(() => updateThisTaskStatus(TaskStatus.Success))
      .catch(error => updateThisTaskStatus(TaskStatus.Failed).switchMapTo(Observable.throw(error)));
  }

  private clone(task: CloneTask, branch: string, accessToken: string, updateThisTaskStatus: (status: TaskStatus) => Observable<void>) {
    const repo = task.project.name;
    const clonePath = task.project.projectPath;
    const url = `https://x-access-token:${accessToken}@github.com/${repo}.git`;

    const cloneCommand = `git clone --branch ${branch} --single-branch --depth 1 ${url} ${clonePath}`;

    return updateThisTaskStatus(TaskStatus.InProgress)
      .switchMap(() => this.shell.execute(cloneCommand))
      .switchMap(() => updateThisTaskStatus(TaskStatus.Success))
      .catch(error => updateThisTaskStatus(TaskStatus.Failed).switchMapTo(Observable.throw(error)));
  }
}
