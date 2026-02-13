import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CellDropdownRendererComponent } from './cell-dropdown-renderer.component';

describe('CellDropdownRendererComponent', () => {
  let component: CellDropdownRendererComponent;
  let fixture: ComponentFixture<CellDropdownRendererComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CellDropdownRendererComponent]
    });
    fixture = TestBed.createComponent(CellDropdownRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
