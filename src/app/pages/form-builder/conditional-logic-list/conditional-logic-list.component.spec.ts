import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionalLogicListComponent } from './conditional-logic-list.component';

describe('ConditionalLogicListComponent', () => {
  let component: ConditionalLogicListComponent;
  let fixture: ComponentFixture<ConditionalLogicListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConditionalLogicListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionalLogicListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
