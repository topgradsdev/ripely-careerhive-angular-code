import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAddManuallyComponent } from './student-add-manually.component';

describe('StudentAddManuallyComponent', () => {
  let component: StudentAddManuallyComponent;
  let fixture: ComponentFixture<StudentAddManuallyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentAddManuallyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentAddManuallyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
