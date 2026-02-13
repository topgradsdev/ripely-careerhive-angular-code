import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProfileStudentComponent } from './my-profile-student.component';

describe('MyProfileStudentComponent', () => {
  let component: MyProfileStudentComponent;
  let fixture: ComponentFixture<MyProfileStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyProfileStudentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProfileStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
