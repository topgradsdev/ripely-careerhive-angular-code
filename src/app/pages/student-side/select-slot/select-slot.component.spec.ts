import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectslotComponent } from './select-slot.component';

describe('SelectslotComponent', () => {
  let component: SelectslotComponent;
  let fixture: ComponentFixture<SelectslotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectslotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectslotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
