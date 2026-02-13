import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerVacancSelfCreateComponent } from './employer-vacancy-self-create.component';

describe('EmployerVacancSelfCreateComponent', () => {
  let component: EmployerVacancSelfCreateComponent;
  let fixture: ComponentFixture<EmployerVacancSelfCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployerVacancSelfCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployerVacancSelfCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
