import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerIndustryComponent } from './employer-industry.component';

describe('EmployerIndustryComponent', () => {
  let component: EmployerIndustryComponent;
  let fixture: ComponentFixture<EmployerIndustryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployerIndustryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployerIndustryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
