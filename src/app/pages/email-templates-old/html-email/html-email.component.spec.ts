import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlEmailComponent } from './html-email.component';

describe('HtmlEmailComponent', () => {
  let component: HtmlEmailComponent;
  let fixture: ComponentFixture<HtmlEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HtmlEmailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HtmlEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
