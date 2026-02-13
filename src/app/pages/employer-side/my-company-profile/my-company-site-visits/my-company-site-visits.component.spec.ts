import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCompanySiteVisitsComponent } from './my-company-site-visits.component';

describe('MyCompanySiteVisitsComponent', () => {
  let component: MyCompanySiteVisitsComponent;
  let fixture: ComponentFixture<MyCompanySiteVisitsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyCompanySiteVisitsComponent]
    });
    fixture = TestBed.createComponent(MyCompanySiteVisitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
