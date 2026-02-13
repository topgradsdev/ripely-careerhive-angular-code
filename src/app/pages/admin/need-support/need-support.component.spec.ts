import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeedSupportComponent } from './need-support.component';

describe('NeedSupportComponent', () => {
  let component: NeedSupportComponent;
  let fixture: ComponentFixture<NeedSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NeedSupportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NeedSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
