import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerPlacementComponent } from './employer-placement.component';

describe('EmployerPlacementComponent', () => {
  let component: EmployerPlacementComponent;
  let fixture: ComponentFixture<EmployerPlacementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployerPlacementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployerPlacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
