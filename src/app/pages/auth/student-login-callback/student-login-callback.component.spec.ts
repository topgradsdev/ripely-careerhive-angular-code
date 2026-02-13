import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentLoginCallBackComponent } from './student-login-callback.component';

describe('StudentLoginCallBackComponent', () => {
  let component: StudentLoginCallBackComponent;
  let fixture: ComponentFixture<StudentLoginCallBackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentLoginCallBackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentLoginCallBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
