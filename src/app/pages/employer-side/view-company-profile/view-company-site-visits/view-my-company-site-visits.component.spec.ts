import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMyCompanySiteVisitsComponent } from './view-my-company-site-visits.component';

describe('ViewMyCompanySiteVisitsComponent', () => {
  let component: ViewMyCompanySiteVisitsComponent;
  let fixture: ComponentFixture<ViewMyCompanySiteVisitsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewMyCompanySiteVisitsComponent]
    });
    fixture = TestBed.createComponent(ViewMyCompanySiteVisitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
