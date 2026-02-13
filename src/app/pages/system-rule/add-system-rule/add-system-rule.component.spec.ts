import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSystemRuleComponent } from './add-system-rule.component';

describe('AddSystemRuleComponent', () => {
  let component: AddSystemRuleComponent;
  let fixture: ComponentFixture<AddSystemRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSystemRuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSystemRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
