import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementGroupSearchComponent } from './placement-group-search.component';

describe('PlacementGroupSearchComponent', () => {
  let component: PlacementGroupSearchComponent;
  let fixture: ComponentFixture<PlacementGroupSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlacementGroupSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacementGroupSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
