import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEmailPopupComponent } from './view-email-popup.component';

describe('ViewEmailPopupComponent', () => {
  let component: ViewEmailPopupComponent;
  let fixture: ComponentFixture<ViewEmailPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewEmailPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEmailPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
