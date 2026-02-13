import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeBuilderManagementComponent } from './resume-builder-management.component';

describe('ResumeBuilderManagementComponent', () => {
  let component: ResumeBuilderManagementComponent;
  let fixture: ComponentFixture<ResumeBuilderManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResumeBuilderManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeBuilderManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
