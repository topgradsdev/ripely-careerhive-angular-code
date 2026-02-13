import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCompanyProfileComponent } from './my-company-profile.component';

describe('MyCompanyProfileComponent', () => {
  let component: MyCompanyProfileComponent;
  let fixture: ComponentFixture<MyCompanyProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyCompanyProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCompanyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
