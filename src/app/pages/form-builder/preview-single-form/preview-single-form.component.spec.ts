import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewSingleFormComponent } from './preview-single-form.component';

describe('PreviewSingleFormComponent', () => {
  let component: PreviewSingleFormComponent;
  let fixture: ComponentFixture<PreviewSingleFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewSingleFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewSingleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
