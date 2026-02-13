import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOnboardingComponent } from './admin-onboarding.component';

describe('AdminOnboardingComponent', () => {
  let component: AdminOnboardingComponent;
  let fixture: ComponentFixture<AdminOnboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminOnboardingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
