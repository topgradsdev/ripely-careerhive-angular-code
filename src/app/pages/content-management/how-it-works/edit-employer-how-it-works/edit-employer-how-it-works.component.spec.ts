import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmployerHowItWorksComponent } from './edit-employer-how-it-works.component';

describe('EditEmployerHowItWorksComponent', () => {
  let component: EditEmployerHowItWorksComponent;
  let fixture: ComponentFixture<EditEmployerHowItWorksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEmployerHowItWorksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEmployerHowItWorksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
