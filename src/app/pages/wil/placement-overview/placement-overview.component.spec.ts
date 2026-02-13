import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementOverviewComponent } from './placement-overview.component';

describe('PlacementOverviewComponent', () => {
  let component: PlacementOverviewComponent;
  let fixture: ComponentFixture<PlacementOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlacementOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacementOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
