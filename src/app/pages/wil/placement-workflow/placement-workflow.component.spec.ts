import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementWorkflowComponent } from './placement-workflow.component';

describe('PlacementWorkflowComponent', () => {
  let component: PlacementWorkflowComponent;
  let fixture: ComponentFixture<PlacementWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlacementWorkflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacementWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
