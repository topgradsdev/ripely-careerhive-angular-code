import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyCreateNewFilterComponent } from './company-create-new-filter.component';

describe('CompanyCreateNewFilterComponent', () => {
  let component: CompanyCreateNewFilterComponent;
  let fixture: ComponentFixture<CompanyCreateNewFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyCreateNewFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyCreateNewFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
