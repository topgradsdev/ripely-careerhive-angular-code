import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementSubmissionsComponent } from './placement-submissions.component';

describe('PlacementSubmissionsComponent', () => {
  let component: PlacementSubmissionsComponent;
  let fixture: ComponentFixture<PlacementSubmissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlacementSubmissionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacementSubmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
