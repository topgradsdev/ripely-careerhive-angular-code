import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportIncidentEmployerFormComponent } from './report-incident-employer-form.component';

describe('ReportIncidentEmployerFormComponent', () => {
  let component: ReportIncidentEmployerFormComponent;
  let fixture: ComponentFixture<ReportIncidentEmployerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportIncidentEmployerFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportIncidentEmployerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
