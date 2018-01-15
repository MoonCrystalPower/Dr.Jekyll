import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { User } from './user'
import { remote } from 'electron';

import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  providers: [ LoginService ],
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  @Input() ps;
  
  errorMessage: string;
  result: Boolean;

  logo_jekyll = 'assets/images/Jekyll.png';
  icon_github = 'assets/images/icon/icon_GitHub.png';

  constructor (
    private loginService: LoginService,
    private router: Router
  ) {
  };

  ngOnInit() { 
    let win = remote.getCurrentWindow();
    win.setFullScreenable(false);
    win.setMaximizable(false);
    win.setSize(780,480,true);
    this.preventDragandDrop();
  };

  login(user:User) {
    this.loginService.requestRepository(user)
                     .then(res => {
                            this.navigateToRepo(res, user.name);
                           },
                           error => this.errorMessage = <any>error);
  }

  private returnResult(data:{result:boolean}): Boolean {
    return data.result;
  }

  private getRepoList(repoList){
    return repoList.map(repo=>repo.name);
  }

  private navigateToRepo(res:any, user:string) {
    if (res.success) {
      this.router.navigate(['/repository',{
        'repo_list' : this.getRepoList(res.repo_list),
        'user': user
      }]);
    }
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