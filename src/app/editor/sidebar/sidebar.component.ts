import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SideBarComponent implements OnInit {
  @Input() dir;
  @Output() filePath = new EventEmitter();
  errorMessage: string;
  result: Boolean;

  icon_fileBrowser = 'assets/images/icon/icon_fileBrowser.svg';
  icon_branchBrowser = 'assets/images/icon/icon_branchBrowser.svg';

  constructor (
    private router: Router
  ) {};

  onUpdate(docInfo) {
    this.filePath.emit(docInfo);
  }

  ngOnInit(){
  };

  ngAfterInit(){
  }
}