import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WilVacanciesListComponent } from './wil-vacancies-list.component';

describe('WilVacanciesListComponent', () => {
  let component: WilVacanciesListComponent;
  let fixture: ComponentFixture<WilVacanciesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WilVacanciesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WilVacanciesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
