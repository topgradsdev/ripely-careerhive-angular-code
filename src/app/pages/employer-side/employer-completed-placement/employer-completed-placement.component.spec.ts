import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerCompletedPlacementComponent } from './employer-completed-placement.component';

describe('EmployerCompletedPlacementComponent', () => {
  let component: EmployerCompletedPlacementComponent;
  let fixture: ComponentFixture<EmployerCompletedPlacementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployerCompletedPlacementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployerCompletedPlacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
