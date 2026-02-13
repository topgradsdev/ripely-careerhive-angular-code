import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerOngoingPlacementDetailsComponent } from './employer-ongoing-placement-details.component';

describe('EmployerOngoingPlacementDetailsComponent', () => {
  let component: EmployerOngoingPlacementDetailsComponent;
  let fixture: ComponentFixture<EmployerOngoingPlacementDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployerOngoingPlacementDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployerOngoingPlacementDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
