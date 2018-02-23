import { Injectable } from '@angular/core';
import * as git from 'simple-git';

@Injectable()
export class GitService {
  constructor(private repoPath: string, private simpleGit) {}

  setRepo(repoPath: string) {
    this.repoPath = repoPath;
    this.simpleGit = git(this.repoPath);
  }

  clone(remote: string) {
    git().silent(true)
        .clone(remote)
        .then(() => console.log('finished'))
        .catch((err) => console.error('failed: ', err));
  }

  checkout(branch_name: string) {
    this.simpleGit.checkout(branch_name);
  }

  createBranch(branch_name: string) {
    this.simpleGit.checkoutLocalBranch(branch_name);
  }

  commit(message: string= 'Write Jekyll blog"') {
    this.simpleGit.add('./*').commit(message);
  }

  pull(remote: string, remote_branch: string) {
    this.simpleGit.pull(remote, remote_branch);
  }

  push(remote: string, remote_branch: string) {
    this.simpleGit.push(remote, remote_branch);
  }
}
