import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { JekyllService } from '../../../jekyll.service'
import { Subscription } from 'rxjs/Subscription';

import * as cp from 'child_process';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class GitService {
  private serverUrl: string = 'http://127.0.0.1:5000/api';

  constructor (private http: Http) {}

  saveRequest (file_path, repo_path, file_header, body, jekyll): Promise<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let dialog = [];
    let build = false;
    jekyll.stdout.on('data', data=>{
      let line = data.toString();
      if (line.indexOf('Regenerating') !== -1){
        build = true;
      }
    })
    return this.http.post(this.serverUrl+'/write_md', {
      'repo_path': repo_path,
      'file_path': file_path,
      'header': file_header,
      'body': body
    }).toPromise()
      .then(res => {
        let result = this.extractData(res).success;
        if (result) {
          if (!build) {
            jekyll.stdout.on('data', data=>{
              let line = data.toString();
              if (line.indexOf('Regenerating') !== -1){
                return true;
              }
            });
          }
          return true;
        } else {
          return false;
        }
      })
  }

  requestGitCommand (gitCommand): Promise<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.serverUrl, {'repo_path':'test_clone' }, options)
                    .toPromise()
                    .then(this.extractData)
                    .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

  private handleError (error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Promise.reject(errMsg);
  }
}

