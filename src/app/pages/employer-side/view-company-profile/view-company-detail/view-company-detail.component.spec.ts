import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCompanyDetailComponent } from './view-company-detail.component';

describe('ViewCompanyDetailComponent', () => {
  let component: ViewCompanyDetailComponent;
  let fixture: ComponentFixture<ViewCompanyDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewCompanyDetailComponent]
    });
    fixture = TestBed.createComponent(ViewCompanyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
