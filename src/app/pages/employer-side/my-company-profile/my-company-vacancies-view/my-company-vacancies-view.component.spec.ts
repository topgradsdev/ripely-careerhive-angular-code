import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCompanyVacanciesViewComponent } from './my-company-vacancies-view.component';

describe('MyCompanyVacanciesViewComponent', () => {
  let component: MyCompanyVacanciesViewComponent;
  let fixture: ComponentFixture<MyCompanyVacanciesViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyCompanyVacanciesViewComponent]
    });
    fixture = TestBed.createComponent(MyCompanyVacanciesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
