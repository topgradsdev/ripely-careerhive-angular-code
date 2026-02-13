import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyVacanciesViewComponent } from './company-vacancies-view.component';

describe('CompanyVacanciesViewComponent', () => {
  let component: CompanyVacanciesViewComponent;
  let fixture: ComponentFixture<CompanyVacanciesViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyVacanciesViewComponent]
    });
    fixture = TestBed.createComponent(CompanyVacanciesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
