import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowTypeFormComponent } from './workflow-type-form.component';

describe('WorkflowTypeFormComponent', () => {
  let component: WorkflowTypeFormComponent;
  let fixture: ComponentFixture<WorkflowTypeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowTypeFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowTypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
