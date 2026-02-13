import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerVacancyComponent } from './employer-vacancy.component';

describe('EmployerVacancyComponent', () => {
  let component: EmployerVacancyComponent;
  let fixture: ComponentFixture<EmployerVacancyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployerVacancyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployerVacancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
