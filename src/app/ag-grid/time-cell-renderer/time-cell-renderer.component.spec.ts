import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeCellRendererComponent } from './time-cell-renderer.component';

describe('TimeCellRendererComponent', () => {
  let component: TimeCellRendererComponent;
  let fixture: ComponentFixture<TimeCellRendererComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimeCellRendererComponent]
    });
    fixture = TestBed.createComponent(TimeCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
