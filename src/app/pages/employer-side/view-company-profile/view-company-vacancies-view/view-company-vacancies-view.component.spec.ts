import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCompanyVacanciesViewComponent } from './view-company-vacancies-view.component';

describe('ViewCompanyVacanciesViewComponent', () => {
  let component: ViewCompanyVacanciesViewComponent;
  let fixture: ComponentFixture<ViewCompanyVacanciesViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewCompanyVacanciesViewComponent]
    });
    fixture = TestBed.createComponent(ViewCompanyVacanciesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
