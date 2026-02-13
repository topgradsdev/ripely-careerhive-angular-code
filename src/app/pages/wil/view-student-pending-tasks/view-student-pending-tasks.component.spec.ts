import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStudentPendingTasksComponent } from './view-student-pending-tasks.component';

describe('ViewStudentPendingTasksComponent', () => {
  let component: ViewStudentPendingTasksComponent;
  let fixture: ComponentFixture<ViewStudentPendingTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewStudentPendingTasksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStudentPendingTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
