import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteVisitsDetailsComponent } from './site-visits-details.component';

describe('SiteVisitsDetailsComponent', () => {
  let component: SiteVisitsDetailsComponent;
  let fixture: ComponentFixture<SiteVisitsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiteVisitsDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteVisitsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
