import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentImportViaExcelComponent } from './student-import-via-excel.component';

describe('StudentImportViaExcelComponent', () => {
  let component: StudentImportViaExcelComponent;
  let fixture: ComponentFixture<StudentImportViaExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentImportViaExcelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentImportViaExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
