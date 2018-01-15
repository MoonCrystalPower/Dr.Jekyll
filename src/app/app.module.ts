import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { Router } from '@angular/router';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { StartComponent } from './start/start.component';
import { LoginComponent } from './login/login.component';
import { LoginService } from './login/login.service';
import { RepositoryComponent } from './repository/repository.component';
import { EditorComponent } from './editor/editor.component';
import { SideBarComponent } from './editor/sidebar/sidebar.component';
import { FileBrowserComponent } from './editor/sidebar/file-browser/file-browser.component';
import { LiveEditorComponent } from './editor/live-editor/live-editor.component';
import { ModalService } from './editor/modal.service';
import { HeaderComponent } from './editor/header-editor/header-editor.component'

import { JekyllService } from './jekyll.service';

import { TreeModule } from 'angular-tree-component';
import { SafePipe } from './safe.pipe';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    AppRoutingModule,
    TreeModule
  ],
  declarations: [
    AppComponent,
    StartComponent,
    LoginComponent,
    RepositoryComponent,
    EditorComponent,
    SideBarComponent,
    FileBrowserComponent,
    LiveEditorComponent,
    SafePipe,
    HeaderComponent
  ],
  providers: [
    JekyllService,
    ModalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(router:Router) {  
  }
}
