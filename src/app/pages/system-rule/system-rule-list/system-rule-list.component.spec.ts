import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemRuleListComponent } from './system-rule-list.component';

describe('SystemRuleListComponent', () => {
  let component: SystemRuleListComponent;
  let fixture: ComponentFixture<SystemRuleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemRuleListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemRuleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
