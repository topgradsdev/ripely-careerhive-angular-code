import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementOverviewProjectComponent } from './placement-overview-project.component';

describe('PlacementOverviewProjectComponent', () => {
  let component: PlacementOverviewProjectComponent;
  let fixture: ComponentFixture<PlacementOverviewProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlacementOverviewProjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacementOverviewProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
