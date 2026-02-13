import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerProjectComponent } from './employer-project.component';

describe('EmployerProjectComponent', () => {
  let component: EmployerProjectComponent;
  let fixture: ComponentFixture<EmployerProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployerProjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployerProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
