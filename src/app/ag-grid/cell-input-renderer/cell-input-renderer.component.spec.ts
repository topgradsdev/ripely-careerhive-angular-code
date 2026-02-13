import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CellInputRendererComponent } from './cell-input-renderer.component';

describe('CellInputRendererComponent', () => {
  let component: CellInputRendererComponent;
  let fixture: ComponentFixture<CellInputRendererComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CellInputRendererComponent]
    });
    fixture = TestBed.createComponent(CellInputRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
