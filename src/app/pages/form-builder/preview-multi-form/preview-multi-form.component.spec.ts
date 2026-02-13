import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewMultiFormComponent } from './preview-multi-form.component';

describe('PreviewMultiFormComponent', () => {
  let component: PreviewMultiFormComponent;
  let fixture: ComponentFixture<PreviewMultiFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewMultiFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewMultiFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
