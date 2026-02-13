import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMyCompanySubmissionsComponent } from './view-my-company-submissions.component';

describe('ViewMyCompanySubmissionsComponent', () => {
  let component: ViewMyCompanySubmissionsComponent;
  let fixture: ComponentFixture<ViewMyCompanySubmissionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewMyCompanySubmissionsComponent]
    });
    fixture = TestBed.createComponent(ViewMyCompanySubmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
