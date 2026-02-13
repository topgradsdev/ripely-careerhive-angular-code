import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerSiteVisitsDetailsComponent } from './employer-site-visits-details.component';

describe('EmployerSiteVisitsDetailsComponent', () => {
  let component: EmployerSiteVisitsDetailsComponent;
  let fixture: ComponentFixture<EmployerSiteVisitsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployerSiteVisitsDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployerSiteVisitsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
