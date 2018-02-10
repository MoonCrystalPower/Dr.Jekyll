import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  template: `<h1>{{ 'WELCOME' | translate }}</h1>`
})

export class AppComponent {
  constructor(private translate: TranslateService) {
    translate.addLangs(['en', 'ko']);
    translate.setDefaultLang('en');
    translate.use('en');
  }

  changeTo(lang: string) {
    this.translate.use(lang);
  }
}
