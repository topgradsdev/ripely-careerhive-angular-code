import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentSearchDatabaseComponent } from './student-search-database.component';

describe('StudentSearchDatabaseComponent', () => {
  let component: StudentSearchDatabaseComponent;
  let fixture: ComponentFixture<StudentSearchDatabaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentSearchDatabaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentSearchDatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
