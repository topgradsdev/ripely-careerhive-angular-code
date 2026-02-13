import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlacklistCompanyImportViaExcelComponent } from './blacklist-company-import-via-excel.component';

describe('BlacklistCompanyImportViaExcelComponent', () => {
  let component: BlacklistCompanyImportViaExcelComponent;
  let fixture: ComponentFixture<BlacklistCompanyImportViaExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlacklistCompanyImportViaExcelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlacklistCompanyImportViaExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
