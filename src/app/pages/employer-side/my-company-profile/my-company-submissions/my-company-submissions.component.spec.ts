import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCompanySubmissionsComponent } from './my-company-submissions.component';

describe('MyCompanySubmissionsComponent', () => {
  let component: MyCompanySubmissionsComponent;
  let fixture: ComponentFixture<MyCompanySubmissionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyCompanySubmissionsComponent]
    });
    fixture = TestBed.createComponent(MyCompanySubmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
