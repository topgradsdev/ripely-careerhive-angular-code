import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStudentApprovalsComponent } from './view-student-approvals.component';

describe('ViewStudentApprovalsComponent', () => {
  let component: ViewStudentApprovalsComponent;
  let fixture: ComponentFixture<ViewStudentApprovalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewStudentApprovalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStudentApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
