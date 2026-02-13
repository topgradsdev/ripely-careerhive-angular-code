import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsStudentFilteringComponent } from './analytics-student-filtering.component';

describe('AnalyticsStudentFilteringComponent', () => {
  let component: AnalyticsStudentFilteringComponent;
  let fixture: ComponentFixture<AnalyticsStudentFilteringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalyticsStudentFilteringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsStudentFilteringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
