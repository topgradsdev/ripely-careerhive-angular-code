import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraduateIndustryComponent } from './graduate-industry.component';

describe('GraduateIndustryComponent', () => {
  let component: GraduateIndustryComponent;
  let fixture: ComponentFixture<GraduateIndustryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraduateIndustryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraduateIndustryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
