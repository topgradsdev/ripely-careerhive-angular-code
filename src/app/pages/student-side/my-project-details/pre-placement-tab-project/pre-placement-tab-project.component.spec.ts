import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrePlacementTabProjectComponent } from './pre-placement-tab-project.component';

describe('PrePlacementTabProjectComponent', () => {
  let component: PrePlacementTabProjectComponent;
  let fixture: ComponentFixture<PrePlacementTabProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrePlacementTabProjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrePlacementTabProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
