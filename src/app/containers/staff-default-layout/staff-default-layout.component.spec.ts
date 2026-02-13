import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffDefaultLayoutComponent } from './staff-default-layout.component';

describe('StaffDefaultLayoutComponent', () => {
  let component: StaffDefaultLayoutComponent;
  let fixture: ComponentFixture<StaffDefaultLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffDefaultLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffDefaultLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
