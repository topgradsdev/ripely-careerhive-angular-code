import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CellNumberRendererComponent } from './cell-number-renderer.component';

describe('CellNumberRendererComponent', () => {
  let component: CellNumberRendererComponent;
  let fixture: ComponentFixture<CellNumberRendererComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CellNumberRendererComponent]
    });
    fixture = TestBed.createComponent(CellNumberRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
