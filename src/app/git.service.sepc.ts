
import { TestBed, async, inject } from '@angular/core/testing';
import { gitService } from './git.service';

describe('Service: gitService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [gitService]
    });
  });

  it('should ...', inject([gitService], (service: gitService) => {
    expect(service).toBeTruthy();
  }));
  
});