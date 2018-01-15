import { Component, OnInit, ElementRef, ViewChild,
         Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { TreeComponent,
         IActionMapping, ITreeOptions } from 'angular-tree-component';
  
import * as fs from 'fs';
import * as path from 'path';

import { HeaderVariable } from './headerVariable';

@Component({
  selector: 'side-content',
  templateUrl: './file-browser.component.html',
  styleUrls: ['./file-browser.component.scss']
})

export class FileBrowserComponent implements OnInit {
  @Input() dir: string;
  @Output() fileLink = new EventEmitter();

  url= 'http://localhost:4000';
  errorMessage: string;
  result: Boolean;
  nodes = [];
  index: number = 0;

  icon_newFile = 'assets/images/icon/icon_newFile.svg';
  icon_newDirectory = 'assets/images/icon/icon_newDirectory.svg';
  icon_refresh = 'assets/images/icon/icon_refresh.svg';
  icon_delete = 'assets/images/icon/icon_delete.svg';

  options: ITreeOptions = {
    actionMapping: {
      mouse: {
        click: (tree, node, $event) => {
          this.fileLink.emit({
            path: node.data.link,
            file: node.data.file,
            header: node.data.header
          });
        }
      }
    },
  }

  constructor (
    private router: Router,
    private elementRef: ElementRef 
  ) {};

  @ViewChild(TreeComponent)
  private tree: TreeComponent;

  ngOnInit(){
    this.makeDirectoryTree(this.dir, (err, res) => {
      this.nodes = res;
      this.tree.treeModel.update();
    });
  };

  /**
   * makeDirectoryTree
   * 
   * TODO : 트리가 깊어지면 빈 트리를 반환하는 경우가 생김. 해결 필요.
   * @param dir 
   * @param funcDone 
   */
  private makeDirectoryTree(dir, funcDone) {
    let res = [];

    fs.readdir(dir, (err,files) => {
      if (err) throw err;

      let isEmpty = files.length;
      
      if (!isEmpty) {
        return;
      }

      for (let file of files) {
        file = path.resolve(dir, file);
        fs.stat(file, (err, stats) => {
          if (stats && 
              stats.isDirectory() && 
              path.basename(file)[0]!=='.') {
            this.makeDirectoryTree(file, (err, result) => {
              res.push({
                id: this.index++,
                name: path.basename(file),
                type: 'folder',
                children: result
              });
              if (!--isEmpty)
                funcDone(null, res);
            });
          } else {
            let basename = path.basename(file);
            let MD_FORMAT = '\\.(MARKDOWN|MD|markdown|md)$';
            if(new RegExp(MD_FORMAT,'i').test(basename)){
              let header = this.mdHeaderParser(file);
              let permalink = this.generateUrl(basename, header);
              res.push({
                id: this.index++,
                name: basename,
                type: 'file',
                link: this.url + permalink,
                file: file,
                header: header
              });
            }
            if (!--isEmpty)
              funcDone(null, res);
          }
        });
      }
    });
  }

  /**
   * generateUrl
   * 
   * Generate link to rendered html of md file
   * 
   * @param {Array<HeaderVariabl>} header
   * @return {string}
   */
  private generateUrl(file:string, header:Array<HeaderVariable>): string {
    if (header === undefined)
      return undefined;
  
    let permalink;
    let permalinkVariable = header.find(
      variable =>'permalink' === variable.key);
    if (permalinkVariable === undefined) {
      let defaultPermalink = this.getDefaultPermalink(this.dir);
      if (defaultPermalink === undefined) {
        permalink = this.getPermalink(file, header,'date');
      } else {
      permalink = this.getPermalink(file, header, defaultPermalink);
      }
     } else {
      permalink = this.getPermalink(file, header, permalinkVariable.value);
    }
    return permalink;
  }

  /**
   * getDefaultPermalink
   * 
   * return permalink value in _config.yml
   * if there is no permalink setting in _config.yml, return undefined
   * 
   * @param {string} baseDir base directory of jekyll project
   * @return {string|undefined} default value of permalink in _config.yml
   */
  private getDefaultPermalink(baseDir: string): string {
    let file = fs.readFileSync(path.resolve(baseDir,'_config.yml'),'utf8');
    let data = file.match(/permalink:\s*\S*\n/);

    if (data !== null) {
      // Split "permalink: value" to [permalink, value]
      // and return value of permalink
      let permalink = data[0].split('\n')[0];
      return permalink.split(permalink.match(/:\s*/)[0])[1];
    } else {
      // If there is no permalink value, reuturn undefined
      return undefined;
    }
  }

  private getPermalink(file: string,
                       header: Array<HeaderVariable>,
                       permalink: string): string {
    
    if (header === undefined) {
      return undefined;
    }

    let preset = {
      date : '/:categories/:year/:month/:day/:title',
      pretty : '/:categories/:year/:month/:day/:title',
      ordinal : '/:categories/:year/:y_day/:title',
      none : '/:categories/:title'
    }

    let fileDate;
    let fileDateFound = file.match(/\d{4}-\d{2}-\d{2}/);
    if (fileDateFound === null)
      fileDate = '';
    else
      fileDate = fileDateFound[0];
    let fileTitle = file.substring(fileDate.length+1)
                        .match(/\S*./)[0]
                        .split('.')[0];
    let date = fileDate.split('-');

    let templateVariable = {
        year : '',
        month : '',
        i_month : '',    // TODO
        day : '',
        i_day : '',      // TODO
        y_day : '',      // TODO
        short_year : '', // TODO
        hour : '',       // TODO
        minute : '',     // TODO
        second : '',     // TODO
        title : fileTitle,
        slug : '',       // TODO
        categories : ''
    }
    
    // Overide date with front matter
    let dateVariable = header.find(variable => variable.key === 'date');
    if (dateVariable) {
      let dateValue = dateVariable.value;
      templateVariable['year'] =
        dateValue.getFullYear().toString();
      templateVariable['month'] =
        (dateValue.getMonth()+101).toString().substr(1);
      templateVariable['day'] =
        (dateValue.getDate()+100).toString().substr(1);
    }

    // Overide title with front matter
    /*
    let titleVariable = header.find(variable => variable.key === 'title');
    if (titleVariable !== undefined){
      templateVariable['title'] = titleVariable.value.replace(' ','-');
    }
    */
    // Overide categories with front matter
    let categoriesVariable = header.find(
      variable => variable.key === 'category' || variable.key === 'categories');
    
    if (categoriesVariable !== undefined) {
      templateVariable['categories'] =
        categoriesVariable.value.split(' ').join('/');
    }

    if (permalink === undefined) {
      permalink = preset['date'];
    } else if (permalink.match(/date|pretty|ordinal|none/) !== null) {
      permalink = preset[permalink];
    } else if (permalink.match(/:[a-z]*/) === null) {
      return permalink+'index.html';
    }

    while (permalink.match(/:[a-z]*/) !== null) {
      let variable = permalink.match(/:[a-z]*_?[a-z]*/)[0].substring(1);
      permalink = permalink.replace(':'+variable, templateVariable[variable]);
    }

    if (permalink.match(/\S*.html/) === null) {
      if (permalink.slice(-1) === '/') {
        permalink = permalink.substr(0,permalink.length-1);
      }
      permalink = permalink+'.html';
    }
    return permalink;
  }

  /**
   * Parser to parse header of md file
   * 
   * @param {string} file absolute path of file
   * @return {Array<HeaderVariable>} Array of header variables
   */
  private mdHeaderParser(file:string): Array<HeaderVariable> {
    // extract text lists in header texts
    let data = fs.readFileSync(file,'utf8').split('\n');
    let headerVariable = [];
    if (data.splice(0,1).toString() !== '---'){
      console.error('no matching header format');
      return undefined;
    }
    let endOfHeader = data.indexOf('---');
    if (endOfHeader === -1) {
      console.error('no matching header format');
      return undefined;
    } else {
      data = data.splice(0,endOfHeader);
    }

    // return header variables
    data.forEach(line => {
      if (line.match(/# \S*/) === null) {
        let isVariable = line.match(/:\s*/);
        let variable;
        if (isVariable !== null) {
          variable = line.split(isVariable[0]);
          if (variable[0] === 'date') {
            variable[1] = new Date(variable[1]);
          }
          headerVariable.push(new HeaderVariable(variable[0],variable[1]));
        }
      }
    });

    return headerVariable;
  }
}
