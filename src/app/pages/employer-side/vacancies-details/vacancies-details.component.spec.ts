import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacanciesDetailsComponent } from './vacancies-details.component';

describe('VacanciesDetailsComponent', () => {
  let component: VacanciesDetailsComponent;
  let fixture: ComponentFixture<VacanciesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VacanciesDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VacanciesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
