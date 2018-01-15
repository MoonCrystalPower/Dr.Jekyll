/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { HttpModule, ConnectionBackend, Response, ResponseOptions, RequestOptions } from '@angular/http/';
import { LoginComponent } from './login.component';
import { LoginService } from './login.service';
import { User } from './user'

describe('LoginComponent', () => {
  let component: LoginComponent;
  let service: LoginService;
  let fixture;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      providers: [ LoginService,
                   ConnectionBackend,
                   HttpModule ],
    });
    TestBed.compileComponents();
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(LoginComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should render input id name user `, async(() => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#user')).not.toBeUndefined();
  }));

  it('should render input id name password', async(() => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#password')).not.toBeUndefined();
  }));

  it('Login result have to be boolean', async(()=>{
    const fixture = TestBed.createComponent(LoginComponent);
    service = fixture.debugElement.injector.get(LoginService);
    component = fixture.componentInstance;
    expect(typeof component.result).toBe('boolean');
  }));
});
