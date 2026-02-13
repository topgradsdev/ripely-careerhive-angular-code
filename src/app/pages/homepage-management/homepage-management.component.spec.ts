import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageManagementComponent } from './homepage-management.component';

describe('HomepageManagementComponent', () => {
  let component: HomepageManagementComponent;
  let fixture: ComponentFixture<HomepageManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomepageManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomepageManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
