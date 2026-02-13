import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingCompanyApprovavalsComponent } from './pending-company-approvavals.component';

describe('PendingCompanyApprovavalsComponent', () => {
  let component: PendingCompanyApprovavalsComponent;
  let fixture: ComponentFixture<PendingCompanyApprovavalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingCompanyApprovavalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingCompanyApprovavalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
