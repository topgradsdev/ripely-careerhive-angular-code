import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerPlacementDetailsComponent } from './employer-placement-details.component';

describe('EmployerPlacementDetailsComponent', () => {
  let component: EmployerPlacementDetailsComponent;
  let fixture: ComponentFixture<EmployerPlacementDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployerPlacementDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployerPlacementDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
