import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyStudentsListComponent } from './company-students-list.component';

describe('CompanyStudentsListComponent', () => {
  let component: CompanyStudentsListComponent;
  let fixture: ComponentFixture<CompanyStudentsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyStudentsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyStudentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
