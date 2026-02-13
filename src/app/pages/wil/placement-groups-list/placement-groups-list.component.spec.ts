import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementGroupsListComponent } from './placement-groups-list.component';

describe('PlacementGroupsListComponent', () => {
  let component: PlacementGroupsListComponent;
  let fixture: ComponentFixture<PlacementGroupsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlacementGroupsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacementGroupsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
