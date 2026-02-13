import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportIncidentStudentFormComponent } from './report-incident-student-form.component';

describe('ReportIncidentStudentFormComponent', () => {
  let component: ReportIncidentStudentFormComponent;
  let fixture: ComponentFixture<ReportIncidentStudentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportIncidentStudentFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportIncidentStudentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
