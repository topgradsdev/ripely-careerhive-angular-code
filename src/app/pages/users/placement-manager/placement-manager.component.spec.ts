import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementManagerComponent } from './placement-manager.component';

describe('PlacementManagerComponent', () => {
  let component: PlacementManagerComponent;
  let fixture: ComponentFixture<PlacementManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlacementManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacementManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
