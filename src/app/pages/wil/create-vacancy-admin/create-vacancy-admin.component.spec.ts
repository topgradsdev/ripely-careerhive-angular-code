import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVacancyAdminComponent } from './create-vacancy-admin.component';

describe('CreateVacancyAdminComponent', () => {
  let component: CreateVacancyAdminComponent;
  let fixture: ComponentFixture<CreateVacancyAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateVacancyAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateVacancyAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
