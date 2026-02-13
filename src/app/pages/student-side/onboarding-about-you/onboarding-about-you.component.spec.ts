import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingAboutYouComponent } from './onboarding-about-you.component';

describe('OnboardingAboutYouComponent', () => {
  let component: OnboardingAboutYouComponent;
  let fixture: ComponentFixture<OnboardingAboutYouComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingAboutYouComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingAboutYouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
