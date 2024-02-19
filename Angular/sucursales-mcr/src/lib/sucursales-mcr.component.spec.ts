import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SucursalesMcrComponent } from './sucursales-mcr.component';

describe('SucursalesMcrComponent', () => {
  let component: SucursalesMcrComponent;
  let fixture: ComponentFixture<SucursalesMcrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SucursalesMcrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SucursalesMcrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
