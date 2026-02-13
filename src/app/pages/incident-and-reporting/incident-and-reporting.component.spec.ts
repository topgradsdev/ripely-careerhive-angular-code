import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentAndReportingComponent } from './incident-and-reporting.component';

describe('IncidentAndReportingComponent', () => {
  let component: IncidentAndReportingComponent;
  let fixture: ComponentFixture<IncidentAndReportingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentAndReportingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentAndReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
