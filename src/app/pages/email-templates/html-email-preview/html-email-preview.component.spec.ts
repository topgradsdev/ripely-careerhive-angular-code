import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlEmailPreviewComponent } from './html-email-preview.component';

describe('HtmlEmailPreviewComponent', () => {
  let component: HtmlEmailPreviewComponent;
  let fixture: ComponentFixture<HtmlEmailPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HtmlEmailPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HtmlEmailPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
