import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementProjectEligibleStudentsComponent } from './placement-project-eligible-students.component';

describe('PlacementProjectEligibleStudentsComponent', () => {
  let component: PlacementProjectEligibleStudentsComponent;
  let fixture: ComponentFixture<PlacementProjectEligibleStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlacementProjectEligibleStudentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacementProjectEligibleStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
