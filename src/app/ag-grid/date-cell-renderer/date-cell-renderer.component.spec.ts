import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateCellRendererComponent } from './date-cell-renderer.component';

describe('DateCellRendererComponent', () => {
  let component: DateCellRendererComponent;
  let fixture: ComponentFixture<DateCellRendererComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DateCellRendererComponent]
    });
    fixture = TestBed.createComponent(DateCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
