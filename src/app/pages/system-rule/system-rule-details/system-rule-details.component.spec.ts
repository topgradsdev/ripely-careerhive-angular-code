import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemRuleDetailComponent } from './system-rule-details.component';

describe('SystemRuleDetailComponent', () => {
  let component: SystemRuleDetailComponent;
  let fixture: ComponentFixture<SystemRuleDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemRuleDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemRuleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
