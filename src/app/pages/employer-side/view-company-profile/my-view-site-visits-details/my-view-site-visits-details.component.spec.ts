import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyViewSiteVisitsDetailsComponent } from './my-view-site-visits-details.component';

describe('MyViewSiteVisitsDetailsComponent', () => {
  let component: MyViewSiteVisitsDetailsComponent;
  let fixture: ComponentFixture<MyViewSiteVisitsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyViewSiteVisitsDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyViewSiteVisitsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
