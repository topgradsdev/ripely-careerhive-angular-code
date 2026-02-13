import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewFormsComponent } from './preview-forms.component';

describe('PreviewFormsComponent', () => {
  let component: PreviewFormsComponent;
  let fixture: ComponentFixture<PreviewFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewFormsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
