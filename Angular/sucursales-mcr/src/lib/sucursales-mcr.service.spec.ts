import { TestBed } from '@angular/core/testing';

import { SucursalesMcrService } from './sucursales-mcr.service';

describe('SucursalesMcrService', () => {
  let service: SucursalesMcrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SucursalesMcrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
