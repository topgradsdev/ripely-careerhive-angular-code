import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitedFormListComponent } from './submited-form-list.component';

describe('SubmitedFormListComponent', () => {
  let component: SubmitedFormListComponent;
  let fixture: ComponentFixture<SubmitedFormListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitedFormListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitedFormListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
