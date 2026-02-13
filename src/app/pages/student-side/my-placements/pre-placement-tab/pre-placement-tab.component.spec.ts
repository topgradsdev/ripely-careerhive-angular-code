import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrePlacementTabComponent } from './pre-placement-tab.component';

describe('PrePlacementTabComponent', () => {
  let component: PrePlacementTabComponent;
  let fixture: ComponentFixture<PrePlacementTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrePlacementTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrePlacementTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
