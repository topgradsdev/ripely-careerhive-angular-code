import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerProjectCreateComponent } from './employer-create-project.component';

describe('EmployerProjectCreateComponent', () => {
  let component: EmployerProjectCreateComponent;
  let fixture: ComponentFixture<EmployerProjectCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployerProjectCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployerProjectCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
