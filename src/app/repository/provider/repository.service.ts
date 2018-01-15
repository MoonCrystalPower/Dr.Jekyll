import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Repository } from '../repository'
import 'rxjs/add/operator/toPromise';

@Injectable()
export class RepositoryService {
  private hydeUrl: string = 'http://127.0.0.1:5000/api/clone';

  constructor (private http: Http) {}
  
  cloneRepository(user, repo, path): Promise<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let repo_url = 'https://github.com/'+user+'/'+repo;
      return this.http.post(this.hydeUrl, {
        'repo_url': repo_url, 'repo_path': path }, options)
                      .toPromise()
                      .then(res => this.extractData(res))
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

