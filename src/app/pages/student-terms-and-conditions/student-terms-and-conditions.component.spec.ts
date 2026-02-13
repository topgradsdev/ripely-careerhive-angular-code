import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentTermsAndConditionsComponent } from './student-terms-and-conditions.component';

describe('StudentTermsAndConditionsComponent', () => {
  let component: StudentTermsAndConditionsComponent;
  let fixture: ComponentFixture<StudentTermsAndConditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentTermsAndConditionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentTermsAndConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
