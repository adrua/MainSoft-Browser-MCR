import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomovilesMcrComponent } from './automoviles-mcr.component';

describe('AutomovilesMcrComponent', () => {
  let component: AutomovilesMcrComponent;
  let fixture: ComponentFixture<AutomovilesMcrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutomovilesMcrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutomovilesMcrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
