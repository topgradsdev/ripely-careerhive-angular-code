import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndustryPartnerAddBySearchingComponent } from './industry-partner-add-by-searching.component';

describe('IndustryPartnerAddBySearchingComponent', () => {
  let component: IndustryPartnerAddBySearchingComponent;
  let fixture: ComponentFixture<IndustryPartnerAddBySearchingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndustryPartnerAddBySearchingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndustryPartnerAddBySearchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
