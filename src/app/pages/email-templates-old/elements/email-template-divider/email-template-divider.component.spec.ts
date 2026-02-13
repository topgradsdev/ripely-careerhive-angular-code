import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailTemplateDividerComponent } from './email-template-divider.component';

describe('EmailTemplateDividerComponent', () => {
  let component: EmailTemplateDividerComponent;
  let fixture: ComponentFixture<EmailTemplateDividerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailTemplateDividerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailTemplateDividerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
