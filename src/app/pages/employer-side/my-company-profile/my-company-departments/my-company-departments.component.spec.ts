import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCompanyDepartmentsComponent } from './my-company-departments.component';

describe('MyCompanyDepartmentsComponent', () => {
  let component: MyCompanyDepartmentsComponent;
  let fixture: ComponentFixture<MyCompanyDepartmentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyCompanyDepartmentsComponent]
    });
    fixture = TestBed.createComponent(MyCompanyDepartmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
