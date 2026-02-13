import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUsersListComponent } from './view-users-list.component';

describe('ViewUsersListComponent', () => {
  let component: ViewUsersListComponent;
  let fixture: ComponentFixture<ViewUsersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewUsersListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUsersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
