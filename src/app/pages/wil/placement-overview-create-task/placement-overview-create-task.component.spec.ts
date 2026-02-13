import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementOverviewCreateTaskComponent } from './placement-overview-create-task.component';

describe('PlacementOverviewCreateTaskComponent', () => {
  let component: PlacementOverviewCreateTaskComponent;
  let fixture: ComponentFixture<PlacementOverviewCreateTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlacementOverviewCreateTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacementOverviewCreateTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
