import { TestBed } from '@angular/core/testing';

import { AutomovilesMcrService } from './automoviles-mcr.service';

describe('AutomovilesMcrService', () => {
  let service: AutomovilesMcrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutomovilesMcrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
