import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUserSuperAdminComponent } from './view-user-super-admin.component';

describe('ViewUserSuperAdminComponent', () => {
  let component: ViewUserSuperAdminComponent;
  let fixture: ComponentFixture<ViewUserSuperAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewUserSuperAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUserSuperAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
