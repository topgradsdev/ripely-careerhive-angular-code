import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndustryPartnerImportViaExcelComponent } from './industry-partner-import-via-excel.component';

describe('IndustryPartnerImportViaExcelComponent', () => {
  let component: IndustryPartnerImportViaExcelComponent;
  let fixture: ComponentFixture<IndustryPartnerImportViaExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndustryPartnerImportViaExcelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndustryPartnerImportViaExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
