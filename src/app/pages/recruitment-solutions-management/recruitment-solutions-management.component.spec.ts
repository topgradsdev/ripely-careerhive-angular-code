import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitmentSolutionsManagementComponent } from './recruitment-solutions-management.component';

describe('RecruitmentSolutionsManagementComponent', () => {
  let component: RecruitmentSolutionsManagementComponent;
  let fixture: ComponentFixture<RecruitmentSolutionsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruitmentSolutionsManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruitmentSolutionsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
