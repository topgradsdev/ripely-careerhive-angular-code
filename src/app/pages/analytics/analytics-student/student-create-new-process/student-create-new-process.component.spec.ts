import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCreateNewProcessComponent } from './student-create-new-process.component';

describe('StudentCreateNewProcessComponent', () => {
  let component: StudentCreateNewProcessComponent;
  let fixture: ComponentFixture<StudentCreateNewProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentCreateNewProcessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentCreateNewProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
