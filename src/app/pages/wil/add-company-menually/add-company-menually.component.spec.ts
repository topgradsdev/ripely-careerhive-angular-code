import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCompanyMenuallyComponent } from './add-company-menually.component';

describe('AddCompanyMenuallyComponent', () => {
  let component: AddCompanyMenuallyComponent;
  let fixture: ComponentFixture<AddCompanyMenuallyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCompanyMenuallyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCompanyMenuallyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
