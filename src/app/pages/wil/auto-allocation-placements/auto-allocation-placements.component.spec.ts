import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementsTabComponent } from './auto-allocation-placementscomponent';

describe('PlacementsTabComponent', () => {
  let component: PlacementsTabComponent;
  let fixture: ComponentFixture<PlacementsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlacementsTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacementsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
