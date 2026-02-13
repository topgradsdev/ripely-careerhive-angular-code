import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerOngoingPlacementComponent } from './employer-ongoing-placement.component';

describe('EmployerOngoingPlacementComponent', () => {
  let component: EmployerOngoingPlacementComponent;
  let fixture: ComponentFixture<EmployerOngoingPlacementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployerOngoingPlacementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployerOngoingPlacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
