import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementIndustryPartnersComponent } from './placement-industry-partners.component';

describe('PlacementIndustryPartnersComponent', () => {
  let component: PlacementIndustryPartnersComponent;
  let fixture: ComponentFixture<PlacementIndustryPartnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlacementIndustryPartnersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacementIndustryPartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
