import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementGroupsProjectComponent } from './placement-groups-project.component';

describe('PlacementGroupsProjectComponent', () => {
  let component: PlacementGroupsProjectComponent;
  let fixture: ComponentFixture<PlacementGroupsProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlacementGroupsProjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacementGroupsProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
