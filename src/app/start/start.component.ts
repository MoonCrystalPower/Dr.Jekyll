import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { remote } from 'electron';

import { JekyllService } from '../jekyll.service'

import * as cp from 'child_process';

import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})

export class StartComponent implements OnInit {
  @Input() ps;
  
  errorMessage: string;
  result: Boolean;

  logo_jekyll = 'assets/images/Jekyll.png';
  icon_github = 'assets/images/icon/icon_GitHub.png';

  constructor (
    private router: Router,
    private jekyllService: JekyllService
  ) {
  };

  ngOnInit() { 
    let win = remote.getCurrentWindow();
    win.setFullScreenable(false);
    win.setMaximizable(false);
    win.setSize(780,480,true);
    this.preventDragandDrop();
    this.runHyde();
  };

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  loadRepository() {
    let openProject = this.selectDirectory(this.jekyllService);
    
    openProject.then(this.runJekyll)
               .then(result => this.navigateToEditor(result));
  }

  private selectDirectory(service) {
    return new Promise((resolve, rejected)=>{
      let dialog = remote.dialog;
      resolve({
        path: dialog.showOpenDialog({properties: ['openDirectory']}).toString(),
        service: service
      })
    });
  }
  
  private runJekyll(recived) {
    return new Promise ((resolve, rejected)=>{
      let child = recived.service.runJekyll(recived.path);

      child.stdout.on('data', data => {
        if(data.toString().indexOf('Server running...') !== -1){
          resolve({child: child, path: recived.path, success:true});
        }
      })
    });
  }

  private navigateToEditor(result) {
    if (result.success) {
      this.router.navigate(['/editor',{'src' : result.path }]);
      this.jekyllService.passJekyllProcess(result.child);
    }
  }

  private runHyde(){
    let appPath = remote.app.getAppPath();
    let child = this.jekyllService.runHyde(appPath);

    child.stdout.on('data', data => {
      console.log(data);
      if(data.toString().indexOf('Running on http://127.0.0.1:5000/') !== -1){
        console.log('hyde is running')
      }
    });
  }

  private preventDragandDrop() {
    document.addEventListener('drop', function(e) {
      e.preventDefault();
      e.stopPropagation();
    });
    document.addEventListener('dragover', function(e) {
      e.preventDefault();
      e.stopPropagation();
    });
  }
}