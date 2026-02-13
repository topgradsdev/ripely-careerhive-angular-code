import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCompanySiteVisitsComponent } from './view-company-site-visits.component';

describe('ViewCompanySiteVisitsComponent', () => {
  let component: ViewCompanySiteVisitsComponent;
  let fixture: ComponentFixture<ViewCompanySiteVisitsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewCompanySiteVisitsComponent]
    });
    fixture = TestBed.createComponent(ViewCompanySiteVisitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
