import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAIAgentComponent } from './add-ai-agent.component';

describe('AddAIAgentComponent', () => {
  let component: AddAIAgentComponent;
  let fixture: ComponentFixture<AddAIAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAIAgentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAIAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
