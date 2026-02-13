import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsStudentComponent } from './analytics-student.component';

describe('AnalyticsStudentComponent', () => {
  let component: AnalyticsStudentComponent;
  let fixture: ComponentFixture<AnalyticsStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalyticsStudentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
