import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCompanySubmissionsComponent } from './view-company-submissions.component';

describe('ViewCompanySubmissionsComponent', () => {
  let component: ViewCompanySubmissionsComponent;
  let fixture: ComponentFixture<ViewCompanySubmissionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewCompanySubmissionsComponent]
    });
    fixture = TestBed.createComponent(ViewCompanySubmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
