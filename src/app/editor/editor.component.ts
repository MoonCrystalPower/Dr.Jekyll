import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { remote } from 'electron';
 
@Component({
  selector: 'editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})

export class EditorComponent implements OnInit {
  mdDocInfo;
  errorMessage: string;
  result: Boolean;
  @Input() ps;

  icon_commit = 'assets/images/icon/icon_commit.svg';
  icon_push = 'assets/images/icon/icon_push.svg';
  icon_pull = 'assets/images/icon/icon_pull.svg';
  icon_branch = 'assets/images/icon/icon_branch.svg';

  repositorySrc;

  constructor (
    private route: ActivatedRoute,
    private router: Router
  ) {};

  ngOnInit() { 
    let win = remote.getCurrentWindow();
    win.setSize(1000,500,true);
    win.setMaximizable(true);
    win.setFullScreenable(true);
    win.setResizable(true);
    this.repositorySrc = this.route.snapshot.params.src;
  }



  updateLink(docInfo){ 
    this.mdDocInfo = docInfo;
  }
}