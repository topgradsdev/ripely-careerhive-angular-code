import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LikertScaleFieldComponent } from './likert-scale-field.component';

describe('LikertScaleFieldComponent', () => {
  let component: LikertScaleFieldComponent;
  let fixture: ComponentFixture<LikertScaleFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LikertScaleFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LikertScaleFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
