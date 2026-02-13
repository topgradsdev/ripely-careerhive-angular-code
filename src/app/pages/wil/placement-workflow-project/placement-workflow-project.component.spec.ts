import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementWorkflowProjectComponent } from './placement-workflow-project.component';

describe('PlacementWorkflowProjectComponent', () => {
  let component: PlacementWorkflowProjectComponent;
  let fixture: ComponentFixture<PlacementWorkflowProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlacementWorkflowProjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacementWorkflowProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
