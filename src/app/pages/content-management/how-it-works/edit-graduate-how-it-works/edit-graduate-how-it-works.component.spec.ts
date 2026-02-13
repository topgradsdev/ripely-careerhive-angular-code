import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGraduateHowItWorksComponent } from './edit-graduate-how-it-works.component';

describe('EditGraduateHowItWorksComponent', () => {
  let component: EditGraduateHowItWorksComponent;
  let fixture: ComponentFixture<EditGraduateHowItWorksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditGraduateHowItWorksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGraduateHowItWorksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
