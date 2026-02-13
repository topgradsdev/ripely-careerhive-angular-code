import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCompanyDepartmentsComponent } from './view-company-departments.component';

describe('ViewCompanyDepartmentsComponent', () => {
  let component: ViewCompanyDepartmentsComponent;
  let fixture: ComponentFixture<ViewCompanyDepartmentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewCompanyDepartmentsComponent]
    });
    fixture = TestBed.createComponent(ViewCompanyDepartmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
