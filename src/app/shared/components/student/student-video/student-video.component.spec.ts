import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentVideoComponent } from './student-video.component';

describe('StudentVideoComponent', () => {
  let component: StudentVideoComponent;
  let fixture: ComponentFixture<StudentVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentVideoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
