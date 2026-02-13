import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectStudentFormComponent } from './project-student-form.component';

describe('ProjectStudentFormComponent', () => {
  let component: ProjectStudentFormComponent;
  let fixture: ComponentFixture<ProjectStudentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectStudentFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectStudentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
