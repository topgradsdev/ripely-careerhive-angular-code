import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultilineFieldComponent } from './multiline-field.component';

describe('MultilineFieldComponent', () => {
  let component: MultilineFieldComponent;
  let fixture: ComponentFixture<MultilineFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultilineFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultilineFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
