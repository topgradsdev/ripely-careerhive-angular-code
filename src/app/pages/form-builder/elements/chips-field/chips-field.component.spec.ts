import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipsFieldComponent } from './chips-field.component';

describe('ChipsFieldComponent', () => {
  let component: ChipsFieldComponent;
  let fixture: ComponentFixture<ChipsFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChipsFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChipsFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
