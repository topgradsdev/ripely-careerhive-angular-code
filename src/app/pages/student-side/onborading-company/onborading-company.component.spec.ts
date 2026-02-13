import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboradingCompanyComponent } from './onborading-company.component';

describe('OnboradingCompanyComponent', () => {
  let component: OnboradingCompanyComponent;
  let fixture: ComponentFixture<OnboradingCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OnboradingCompanyComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboradingCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
