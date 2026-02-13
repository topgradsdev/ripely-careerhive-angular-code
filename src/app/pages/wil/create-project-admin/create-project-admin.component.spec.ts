import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProjectAdminComponent } from './create-project-admin.component';

describe('CreateProjectAdminComponent', () => {
  let component: CreateProjectAdminComponent;
  let fixture: ComponentFixture<CreateProjectAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateProjectAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProjectAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
