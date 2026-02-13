import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDefaultLayoutComponent } from './student-default-layout.component';

describe('StudentDefaultLayoutComponent', () => {
  let component: StudentDefaultLayoutComponent;
  let fixture: ComponentFixture<StudentDefaultLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentDefaultLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentDefaultLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
