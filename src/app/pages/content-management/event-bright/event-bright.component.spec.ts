import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventBrightComponent } from './event-bright.component';

describe('EventBrightComponent', () => {
  let component: EventBrightComponent;
  let fixture: ComponentFixture<EventBrightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventBrightComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventBrightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
