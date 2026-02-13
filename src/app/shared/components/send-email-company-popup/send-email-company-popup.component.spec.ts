import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendEmailCompanyPopupComponent } from './send-email-company-popup.component';

describe('SendEmailCompanyPopupComponent', () => {
  let component: SendEmailCompanyPopupComponent;
  let fixture: ComponentFixture<SendEmailCompanyPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendEmailCompanyPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendEmailCompanyPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
