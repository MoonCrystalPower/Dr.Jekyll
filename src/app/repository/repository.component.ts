import { Component, OnInit, ViewChild, ElementRef, Input} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RepositoryService } from './provider/repository.service'
import { Repository } from './repository'
import { remote } from 'electron';

import { JekyllService } from '../jekyll.service'

import * as cp from 'child_process';

import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'repository',  
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.scss'],
  providers: [RepositoryService]
})

export class RepositoryComponent implements OnInit{
  @Input() ps;
  
  repoList: Repository[];
  icon_repo = 'assets/images/icon/icon_repo.png';
  repositorySrc;
  selectedRepo: string;
  userName: string;

  constructor (
    private route: ActivatedRoute,    
    private router: Router,
    private repositoryService: RepositoryService,
    private jekyllService: JekyllService
  ) {}

  ngOnInit() {
    let win = remote.getCurrentWindow();
    win.setFullScreenable(false);
    win.setMaximizable(false);
    win.setSize(780,480,true);
    let params = this.route.snapshot.params;
    this.repoList = params.repo_list.split(',');
    this.userName = params.user;
  }

  loadRepository(): void {
    let openProject = this.selectDirectory(
      this.jekyllService, this.repositoryService,
      this.selectedRepo, this.userName);
    
    openProject
    .then(this.cloneRepo)
    .then(this.runJekyll)
    .then(result => this.navigateToEditor(result))
    .catch((error: Error) => {
      // Not implemented yet
    });
  }

  selectRepo(event) {
    const targetEl:string = event.target.innerText.trim();
    if (targetEl) {
      this.selectedRepo = targetEl;
    }
  }

  private selectDirectory(service: JekyllService,
                          repoService: RepositoryService,
                          repo: string, user: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const dialog = remote.dialog;
      const directory = dialog.showOpenDialog({properties: ['openDirectory']});
      
      if (directory) {
        resolve({
          path: directory.toString(),
          repoService: repoService,
          service: service,
          repo: repo,
          user: user
        })
      } else {
        reject("No directory selected");
      }
    });
  }

  private cloneRepo(recived) {
    return new Promise ((resolve, rejected) => {
      recived.repoService
             .cloneRepository(recived.user, recived.repo, recived.path)
             .then(res => {
                if(res.success){
                 resolve(recived);
                }
             });
    });
  }
  
  private runJekyll(recived) {
    return new Promise ((resolve, rejected)=>{
      console.log(recived);
      let child = recived.service.runJekyll(recived.path);

      child.stdout.on('data', data => {
        if(data.toString().indexOf('Server running...') !== -1){
          resolve({child: child, path: recived.path, success:true});
        }
      })
    });
  }

  private navigateToEditor(result: any): void {
    if (result.success) {
      this.router.navigate(['/editor',{'src' : result.path }]);
      this.jekyllService.passJekyllProcess(result.child);
    }
  }
}