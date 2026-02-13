import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementTypeFormComponent } from './placement-type-form.component';

describe('PlacementTypeFormComponent', () => {
  let component: PlacementTypeFormComponent;
  let fixture: ComponentFixture<PlacementTypeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlacementTypeFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacementTypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
