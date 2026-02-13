import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailTemplateAttachmentComponent } from './email-template-attachment.component';

describe('EmailTemplateAttachmentComponent', () => {
  let component: EmailTemplateAttachmentComponent;
  let fixture: ComponentFixture<EmailTemplateAttachmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailTemplateAttachmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailTemplateAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
