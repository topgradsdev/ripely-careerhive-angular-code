import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsCompanyFilteringComponent } from './analytics-company-filtering.component';

describe('AnalyticsCompanyFilteringComponent', () => {
  let component: AnalyticsCompanyFilteringComponent;
  let fixture: ComponentFixture<AnalyticsCompanyFilteringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalyticsCompanyFilteringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsCompanyFilteringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
