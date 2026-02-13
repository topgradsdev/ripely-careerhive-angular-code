import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStudentProfileComponent } from './view-student-profile.component';

describe('ViewStudentProfileComponent', () => {
  let component: ViewStudentProfileComponent;
  let fixture: ComponentFixture<ViewStudentProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewStudentProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStudentProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
