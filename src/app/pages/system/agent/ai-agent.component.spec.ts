import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AIAgentComponent } from './ai-agent.component';

describe('AIAgentComponent', () => {
  let component: AIAgentComponent;
  let fixture: ComponentFixture<AIAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AIAgentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AIAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
