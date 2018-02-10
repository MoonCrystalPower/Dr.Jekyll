import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { Injector } from '@angular/core';
import { By } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { DebugElement } from '@angular/core/src/debug/debug_node';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

const langMap = {
  en: require('../assets/i18n/en.json'),
  ko: require('../assets/i18n/ko.json')
};

class CustomLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return Observable.of(langMap[lang]);
  }
}

describe('AppComponent', () => {
  let comp: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let translateService: TranslateService;
  let injector: Injector;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppComponent ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: CustomLoader
          }
        })
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    injector = getTestBed();
    translateService = injector.get(TranslateService);

    fixture = TestBed.createComponent(AppComponent);
    comp = fixture.componentInstance;

    de = fixture.debugElement.query(By.css('h1'));
    el = de.nativeElement;
  })

  it('no title in the DOM until manually call `detectChanges`', () => {
    expect(el.textContent).toEqual('');
  });

  it('should display welcome in english', () => {
    fixture.detectChanges();
    expect(el.textContent).toEqual('Welcome to Dr.Jekyll');
  });

  it('should show welcome in Korean', () => {
    comp.changeTo('ko');
    fixture.detectChanges();
    expect(el.textContent).toEqual('Dr.Jekyll에 오신것을 환영합니다!');
  })
});
