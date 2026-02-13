import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStudentOngoingPlacementComponent } from './view-student-ongoing-placement.component';

describe('ViewStudentOngoingPlacementComponent', () => {
  let component: ViewStudentOngoingPlacementComponent;
  let fixture: ComponentFixture<ViewStudentOngoingPlacementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewStudentOngoingPlacementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStudentOngoingPlacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
