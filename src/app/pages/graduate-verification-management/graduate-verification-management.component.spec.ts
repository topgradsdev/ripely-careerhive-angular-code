import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraduateVerificationManagementComponent } from './graduate-verification-management.component';

describe('GraduateVerificationManagementComponent', () => {
  let component: GraduateVerificationManagementComponent;
  let fixture: ComponentFixture<GraduateVerificationManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraduateVerificationManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraduateVerificationManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
