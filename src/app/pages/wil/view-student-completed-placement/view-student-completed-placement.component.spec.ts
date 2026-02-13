import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStudentCompletedPlacementComponent } from './view-student-completed-placement.component';

describe('ViewStudentCompletedPlacementComponent', () => {
  let component: ViewStudentCompletedPlacementComponent;
  let fixture: ComponentFixture<ViewStudentCompletedPlacementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewStudentCompletedPlacementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStudentCompletedPlacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
