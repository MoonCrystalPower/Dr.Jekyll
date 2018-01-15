import { Component, ViewChild, ElementRef,
         OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { GitService } from './provider/git.service';
import { JekyllService } from '../../jekyll.service';
import { ModalService } from '../modal.service'
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'live-editor',
  templateUrl: './live-editor.component.html',
  styleUrls: ['./live-editor.component.scss'],
  providers: [ GitService ]
})

export class LiveEditorComponent implements OnInit, OnChanges {
  @ViewChild('iframe') iframe: ElementRef;
  @Input() mdDoc = {header: [], path:'', file:''};
  @Input() dir;
  @Input() jekyllProcess;
  private subscription: Subscription;
  
  title = 'Hello Dr.Jekyll';
  pagePath = '';
  iframeDoc;
  iframeCont;

  icon_editHeader = 'assets/images/icon/icon_editHeader.svg';
  icon_ol = 'assets/images/icon/icon_ol.svg';
  icon_ul = 'assets/images/icon/icon_ul.svg';
  icon_bold = 'assets/images/icon/icon_bold.svg';
  icon_heading = 'assets/images/icon/icon_heading.svg';
  icon_table = 'assets/images/icon/icon_table.svg';
  icon_deleteTable = 'assets/images/icon/icon_deleteTable.svg';
  icon_add = 'assets/images/icon/icon_add.svg';
  icon_image = 'assets/images/icon/icon_image.svg';
  icon_link = 'assets/images/icon/icon_link.svg';
  icon_quote = 'assets/images/icon/icon_quote.svg';
  icon_code = 'assets/images/icon/icon_code.svg';
  icon_checklist = 'assets/images/icon/icon_checklist.svg';
  icon_ssl = 'assets/images/icon/icon_ssh.svg';
  icon_information = 'assets/images/icon/icon_information.svg';
  icon_emoji = 'assets/images/icon/icon_emoji.svg';
  icon_strike = 'assets/images/icon/icon_strike.svg';
  icon_mention = 'assets/images/icon/icon_mention.svg';

  headingCount = 0;

  constructor ( private router: Router,
                private gitService: GitService,
                private modalService: ModalService,
                private jekyllService: JekyllService ){
                 this.subscription = this.jekyllService.getJekyllProcess().subscribe(ps=>{console.log(ps); this.jekyllProcess = ps;});
                };

  ngOnInit(){};

  ngOnChanges(changes: SimpleChanges){
    if(changes['mdDoc']){
      if(this.mdDoc !== undefined){
        this.pagePath = this.mdDoc.path;
      }
    }
  }

  openHeader(){
    this.modalService.open(this.mdDoc.header, 'header-modal');
  }

  onLoad() {
    let doc = this.iframe.nativeElement.contentDocument || 
              this.iframe.nativeElement.contentWindow.document;
    this.iframeDoc = doc;
    let cont = <HTMLElement>doc.getElementsByClassName('post-content')[0];
    this.iframeCont = cont;
    let baseHref = <HTMLElement>doc.createElement('base');
    baseHref.setAttribute('href',this.dir);
    doc.head.appendChild(baseHref);

    console.log('dir='+this.dir);
    if (cont !== undefined) {
      cont.contentEditable = 'true';
    }

    let links = doc.getElementsByTagName('a');
    for (var index = 0; index < links.length; index++) {
      links[index].removeAttribute('href');
    }
  }
  private bold() {
    this.iframeDoc.execCommand('bold',false, '');
  }

  private heading() {
    this.headingCount = 1;
    this.iframeDoc.execCommand('formatBlock',false,'<h'+this.headingCount+'>');

  }

  private orderedList() {
    this.iframeDoc.execCommand('insertOrderedList',false);
  }

  private unorderedList() {
    this.iframeDoc.execCommand('insertUnorderedList',false);
  }

  private makeBodyToJson() {
    let bodyCont = [].map.call(this.iframeCont.children, node =>{
      return node.outerHTML;
    }).join('');
    return bodyCont;
  }

  save() {
    this.jekyllProcess = this.jekyllService.getJekyll();
    let body = this.makeBodyToJson();
    let filePath = this.mdDoc.file.substring(this.dir.length+1);
    let header = {};
    for (let i = 0; i< this.mdDoc.header.length; i++) {
      header[this.mdDoc.header[i].key] = this.mdDoc.header[i].value;
    }
    
    this.gitService.saveRequest(this.mdDoc.file, this.dir, header, body, this.jekyllProcess)
                   .then(result=>{
                     this.iframeDoc.location.reload(true);
                   })
  }
}
