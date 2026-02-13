import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerSupportComponent } from './employer-support.component';

describe('EmployerSupportComponent', () => {
  let component: EmployerSupportComponent;
  let fixture: ComponentFixture<EmployerSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployerSupportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployerSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
