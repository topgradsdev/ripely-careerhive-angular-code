import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailPreviewHtmlComponent } from './email-preview-html.component';

describe('EmailPreviewHtmlComponent', () => {
  let component: EmailPreviewHtmlComponent;
  let fixture: ComponentFixture<EmailPreviewHtmlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailPreviewHtmlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailPreviewHtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
