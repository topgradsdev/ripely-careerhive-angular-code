import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerOnboardingSelfComponent } from './employer-onboarding-self.component';

describe('EmployerOnboardingSelfComponent', () => {
  let component: EmployerOnboardingSelfComponent;
  let fixture: ComponentFixture<EmployerOnboardingSelfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployerOnboardingSelfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployerOnboardingSelfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
