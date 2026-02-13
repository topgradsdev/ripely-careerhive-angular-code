import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyIncidentReportingListComponent } from './company-incident-reporting-list.component';

describe('CompanyIncidentReportingListComponent', () => {
  let component: CompanyIncidentReportingListComponent;
  let fixture: ComponentFixture<CompanyIncidentReportingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyIncidentReportingListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyIncidentReportingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
