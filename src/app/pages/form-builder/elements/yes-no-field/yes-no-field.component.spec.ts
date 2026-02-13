import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YesNoFieldComponent } from './yes-no-field.component';

describe('YesNoFieldComponent', () => {
  let component: YesNoFieldComponent;
  let fixture: ComponentFixture<YesNoFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YesNoFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YesNoFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
