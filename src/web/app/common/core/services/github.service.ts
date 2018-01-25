import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BuildConfiguration } from './../../../../../common/interfaces/build-configuration';
import { GithubBranch } from './../../../../../common/interfaces/github';
import { GitHubApiService } from './../../../../../common/services/github-api.service';
import { AuthService } from './auth.service';

@Injectable()
export class GitHubService {
  private readonly accessToken: Observable<string>;

  constructor(private auth: AuthService, private github: GitHubApiService) {
    this.accessToken = this.auth.user.map(user => user.githubAccessToken).shareReplay(1);
  }

  getBranches(buildConfiguration: BuildConfiguration) {
    return this.accessToken
      .first()
      .switchMap(accessToken => this.github.get<GithubBranch[]>(`repos/${buildConfiguration.repo}/branches`, accessToken))
      .map(branches => branches.map(branch => branch.name));
  }
}
