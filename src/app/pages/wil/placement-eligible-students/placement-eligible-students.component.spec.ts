import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementEligibleStudentsComponent } from './placement-eligible-students.component';

describe('PlacementEligibleStudentsComponent', () => {
  let component: PlacementEligibleStudentsComponent;
  let fixture: ComponentFixture<PlacementEligibleStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlacementEligibleStudentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacementEligibleStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
