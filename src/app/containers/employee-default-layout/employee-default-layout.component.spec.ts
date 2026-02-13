import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDefaultLayoutComponent } from './employee-default-layout.component';

describe('EmployeeDefaultLayoutComponent', () => {
  let component: EmployeeDefaultLayoutComponent;
  let fixture: ComponentFixture<EmployeeDefaultLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeDefaultLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeDefaultLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
