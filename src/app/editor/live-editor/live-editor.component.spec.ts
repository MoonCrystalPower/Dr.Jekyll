/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { LiveEditorComponent } from './live-editor.component';

describe('LiveEditorComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        LiveEditorComponent
      ],
    });
    TestBed.compileComponents();
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(LiveEditorComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
