import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailTemplateSocialLinkComponent } from './email-template-social-link.component';

describe('EmailTemplateSocialLinkComponent', () => {
  let component: EmailTemplateSocialLinkComponent;
  let fixture: ComponentFixture<EmailTemplateSocialLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailTemplateSocialLinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailTemplateSocialLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
