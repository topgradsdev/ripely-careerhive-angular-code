import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayColumnsPopupComponent } from './display-columns-popup.component';

describe('DisplayColumnsPopupComponent', () => {
  let component: DisplayColumnsPopupComponent;
  let fixture: ComponentFixture<DisplayColumnsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayColumnsPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayColumnsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
