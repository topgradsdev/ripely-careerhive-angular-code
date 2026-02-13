import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGraduateComponent } from './edit-graduate.component';

describe('EditGraduateComponent', () => {
  let component: EditGraduateComponent;
  let fixture: ComponentFixture<EditGraduateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditGraduateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGraduateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
