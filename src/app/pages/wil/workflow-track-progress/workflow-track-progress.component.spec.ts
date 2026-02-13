import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowTrackProgressComponent } from './workflow-track-progress.component';

describe('WorkflowTrackProgressComponent', () => {
  let component: WorkflowTrackProgressComponent;
  let fixture: ComponentFixture<WorkflowTrackProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowTrackProgressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowTrackProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
