import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WilCompaniesListComponent } from './wil-companies-list.component';

describe('WilCompaniesListComponent', () => {
  let component: WilCompaniesListComponent;
  let fixture: ComponentFixture<WilCompaniesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WilCompaniesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WilCompaniesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
