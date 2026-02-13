import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglelineFieldComponent } from './singleline-field.component';

describe('SinglelineFieldComponent', () => {
  let component: SinglelineFieldComponent;
  let fixture: ComponentFixture<SinglelineFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SinglelineFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SinglelineFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
