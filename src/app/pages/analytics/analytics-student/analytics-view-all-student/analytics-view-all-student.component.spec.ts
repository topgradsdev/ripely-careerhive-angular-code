import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsViewAllStudentComponent } from './analytics-view-all-student.component';

describe('AnalyticsViewAllStudentComponent', () => {
  let component: AnalyticsViewAllStudentComponent;
  let fixture: ComponentFixture<AnalyticsViewAllStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalyticsViewAllStudentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsViewAllStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
