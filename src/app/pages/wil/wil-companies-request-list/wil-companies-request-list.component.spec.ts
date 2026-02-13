import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WilCompaniesRequestListComponent } from './wil-companies-request-list.component';

describe('WilCompaniesRequestListComponent', () => {
  let component: WilCompaniesRequestListComponent;
  let fixture: ComponentFixture<WilCompaniesRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WilCompaniesRequestListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WilCompaniesRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
