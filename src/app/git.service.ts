var html2md = require("html2markdown");
var path = require("path");
var promisify = require("promisify-node");
var fse = promisify(require("fs-extra"));
fse.ensureDir = promisify(fse.ensureDir);
const git = require('simple-git/promise');
import { Injectable } from '@angular/core';

@Injectable()
export class gitService {
  constructor(private repoPath: string, private simpleGit) {
  }

  SetRepo(repoPath:string) {
        this.repoPath = repoPath;
        this.simpleGit = require('simple-git')(this.repoPath);
  }

  Clone(remote:string) {
       git().silent(true)
           .clone(remote)
           .then(() => console.log('finished'))
           .catch((err) => console.error('failed: ', err));
  }

  Checkout(branch_name:string) {
        this.simpleGit.checkout(branch_name);
  }

  CreateBranch(branch_name:string) {
      this.simpleGit.checkoutLocalBranch(branch_name);
  }

  Commit() {
      var message:string = "Write Jekyll blog";
      this.simpleGit.add("./*").commit(message);
  }

  Pull(remote:string, remote_branch:string) {
      this.simpleGit.pull(remote, remote_branch);
  }

  Push(remote:string, remote_branch:string){
      this.simpleGit.push(remote, remote_branch);
  }

  HeaderHtml2md(header:any){
      var str:string = "---\n";
      for (var key in header) {
          var value = header[key];
          str +=  key+" : " + value + "\n";
      }
      str += "---\n";
      return str;
  }

  WriteHtml2md(file_name:string, header:any, body:string) {
      var header_md:string = this.HeaderHtml2md(header);
      var body_md:string = html2md(body);
      var md:string = header_md + body_md;
      fse.writeFile(path.join(this.repoPath, file_name), md, (err) => {
          if (err) throw err;
          this.simpleGit.add(file_name);
          console.log(file_name +' is Saved!');
      });
  }

}
