import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerOnboardingComponent } from './employer-onboarding.component';

describe('EmployerOnboardingComponent', () => {
  let component: EmployerOnboardingComponent;
  let fixture: ComponentFixture<EmployerOnboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployerOnboardingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployerOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
