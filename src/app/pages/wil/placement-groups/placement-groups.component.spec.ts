import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementGroupsComponent } from './placement-groups.component';

describe('PlacementGroupsComponent', () => {
  let component: PlacementGroupsComponent;
  let fixture: ComponentFixture<PlacementGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlacementGroupsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacementGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
