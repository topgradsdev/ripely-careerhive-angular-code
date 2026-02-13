import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerProjectDetailsComponent } from './employer-project-details.component';

describe('EmployerProjectDetailsComponent', () => {
  let component: EmployerProjectDetailsComponent;
  let fixture: ComponentFixture<EmployerProjectDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployerProjectDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployerProjectDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
