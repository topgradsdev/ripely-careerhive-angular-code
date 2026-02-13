import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailTemplateButtonComponent } from './email-template-button.component';

describe('EmailTemplateButtonComponent', () => {
  let component: EmailTemplateButtonComponent;
  let fixture: ComponentFixture<EmailTemplateButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailTemplateButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailTemplateButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
