import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementWorkflowCreateTaskComponent } from './placement-workflow-create-task.component';

describe('PlacementWorkflowCreateTaskComponent', () => {
  let component: PlacementWorkflowCreateTaskComponent;
  let fixture: ComponentFixture<PlacementWorkflowCreateTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlacementWorkflowCreateTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacementWorkflowCreateTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
